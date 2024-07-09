import SpecificDay from "../models/specificDayModel.js";

const getDayInfo = async (req, res) => {
  try {
    const { date } = req.params;
    // Find day info by date
    const dayInfo = await SpecificDay.findOne({
      date: new Date(date),
    }).populate("owner", "-password");

    if (!dayInfo) {
      return res.status(404).json({ message: "No information found for this date" });
    }

    res.json(dayInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addDayInfo = async (req, res) => {
  try {
    // Create new day info
    const newDayInfo = new SpecificDay(req.body);
    await newDayInfo.save();
    res.status(201).json(newDayInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteDayInfo = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete day info by ID
    const deletedDayInfo = await SpecificDay.findByIdAndDelete(id);

    if (!deletedDayInfo) {
      return res.status(404).json({ message: "No information found for this ID" });
    }

    res.json({ message: "Information deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { getDayInfo, addDayInfo, deleteDayInfo };
