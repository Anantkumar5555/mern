const Candidate = require('../models/Candidate');
const axios = require('axios');

// 1. Add Candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;
    const newCandidate = new Candidate({ name, email, skills, experience, bio });
    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};

// 2. Get All Candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// 3. Shortlist Candidates (Basic Logic)
exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is mandatory' });
    }

    // Optional: filter by minimum experience at DB level
    const query = {};
    if (minExperience !== undefined) {
      query.experience = { $gte: Number(minExperience) };
    }

    const candidates = await Candidate.find(query);

    const matchedCandidates = candidates.map(candidate => {
      const lowerReqSkills = requiredSkills.map(s => s.toLowerCase());
      const lowerCandSkills = candidate.skills.map(s => s.toLowerCase());
      
      const matchedSkills = lowerCandSkills.filter(skill => lowerReqSkills.includes(skill));
      const score = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0;
      
      return {
        ...candidate.toObject(),
        matchScore: Math.round(score),
        matchedSkills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({ error: 'Failed to match candidates' });
  }
};

// 4. AI-Based Candidate Suggestion
exports.aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience, candidates } = req.body;

    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ error: 'No candidates provided for AI analysis' });
    }

    // Build the prompt
    let candidatesText = candidates.map((c, index) => 
      `${index + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Exp: ${c.experience} years${c.bio ? ` - Bio: ${c.bio}` : ''}`
    ).join('\n');

    const prompt = `
Job requires: ${requiredSkills.join(', ')} (${minExperience ? minExperience + '+ years experience' : 'Experience not specified'})

Candidates:
${candidatesText}

Rank these candidates based on the job requirements. For each candidate, provide a brief, professional explanation of why they are suitable or not suitable. Keep it concise. Return the response in a structured format if possible, or clear paragraphs.`;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-4o-mini", // fallback model if needed, adjust per user preference or use meta-llama/llama-3-8b-instruct:free
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    res.status(200).json({ recommendation: aiMessage });
  } catch (error) {
    console.error('Error from OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI shortlisting' });
  }
};

// 5. Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    
    // Aggregate average experience and top skills
    const stats = await Candidate.aggregate([
      {
        $facet: {
          avgExp: [
            { $group: { _id: null, avgExperience: { $avg: "$experience" } } }
          ],
          skillsCount: [
            { $unwind: "$skills" },
            { $group: { _id: "$skills", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          recentCandidates: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    const result = {
      totalCandidates,
      averageExperience: stats[0].avgExp[0] ? Math.round(stats[0].avgExp[0].avgExperience * 10) / 10 : 0,
      topSkills: stats[0].skillsCount.map(s => ({ name: s._id, count: s.count })),
      recentCandidates: stats[0].recentCandidates
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// 6. Chat with Bot (Context Aware)
exports.chatWithBot = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages history is required' });
    }

    const candidates = await Candidate.find();
    const candidateSummary = candidates.map(c => 
      `- Name: ${c.name}, Email: ${c.email}, Skills: ${c.skills.join(', ')}, Experience: ${c.experience} years, Bio: ${c.bio || 'None'}`
    ).join('\n');

    const systemPrompt = `You are a helpful, professional AI HR Assistant named TalentBot working for TalentAI, a recruitment candidate shortlisting app.
You have access to the candidate database below. Your job is to answer questions about the candidates, recommend candidates based on skills or experience, or answer general HR/recruiting questions.

Here is the current candidate database:
${candidateSummary}

Be conversational, concise, professional, and friendly. If a user asks about a candidate not in the database, politely let them know you don't have records for that person. Always tie your recommendations back to the candidate details in the database. Use markdown to format lists, bold text, etc., where appropriate.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-4o-mini",
      messages: apiMessages
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error('Error from Chatbot AI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to chat with AI' });
  }
};
