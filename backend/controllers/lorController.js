const lorModel = require('../models/lorModel');

// Submit LoR
exports.submitLoR = async (req, res) => {
  const { studentId, facultyId, reason } = req.body;
  await lorModel.submitLoR(studentId, facultyId, reason);
  res.status(201).json({ message: 'LoR request submitted successfully' });
};

// Get LoRs
exports.getLoRs = async (req, res) => {
  const { role } = req.params;
  const loRs = await lorModel.getLoRsByRole(role);
  res.status(200).json(loRs);
};
