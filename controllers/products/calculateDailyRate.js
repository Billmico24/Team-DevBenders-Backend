const calculateDailyRate = ({ currentWeight, height, age, desiredWeight }) => {
    return Math.floor(
        10 * currentWeight +
        6.25 * height -
        5 * age -
        161 - 10 * (currentWeight - desiredWeight),
    );
};

module.exports = calculateDailyRate;