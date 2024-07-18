import shortid from 'shortid';
import { combineJsonFile } from "../helpers/combineJsonFile.js"
import { User } from "../models/usersModel.js";
import { Product } from "../models/productModel.js";
import { Summary } from "../models/summaryModel.js";
import { SpecificDay } from "../models/specificDayModel.js";

const findProducts = async (req, res) => {
    const { search } = req.query;
    const { _id } = req.user;
    const foundProducts = await Product.find({
        "title": { $regex: search, $options: "i" },
        $or: [{ userId: null }, { userId: _id }]
    }).lean();

    if (!foundProducts.length) {
        return res
        .status(400)
        .send({ message: "No products found" });
    }
    return res.status(200).send(foundProducts);
};

const addProduct = async (req, res, next) => {
    const { date, productId, weight } = req.body;
    const { _id } = req.user;

    const product = await Product.findOne({ _id: `${productId}` });
    if (!product) {
        return res
            .status(404)
            .send({ message: "Product not found" });
    }
    const user = await User.findById(_id);
    const allDaysInfo = await Promise.all(user.days.map(dayId => SpecificDay.findById(dayId).exec()));
    const existingDay = allDaysInfo.find((day) => day.date === date);
    const kcalCoefficient = product.calories / product.weight;
    const kcalConsumed = kcalCoefficient * weight;
    const eatenProduct = {
        title: product.title,
        weight,
        kcal: kcalConsumed,
        groupBloodNotAllowed: product.groupBloodNotAllowed,
        id: shortid.generate(),
    };

    if (existingDay) {
        existingDay.eatenProducts.push(eatenProduct);
        await existingDay.save();
        const daySummary = await Summary.findOne({
            $and: [{ date: date }, { userId: req.user._id }],
        });
        daySummary.kcalLeft -= kcalConsumed;
        daySummary.kcalConsumed += kcalConsumed;
        daySummary.percentsOfDailyRate = (daySummary.kcalConsumed * 100) / req.user.userData.dailyRate;
        if (daySummary.kcalLeft < 0) {
            daySummary.kcalLeft = 0;
            daySummary.percentsOfDailyRate = 100;
        }

        console.log('daySummary',daySummary);

        await daySummary.save();
        return res.status(201).send({
            eatenProduct,
            day: {
                id: existingDay._id,
                eatenProducts: existingDay.eatenProducts,
                date: existingDay.date,
                daySummary: existingDay.daySummary,
            },
            daySummary: {
                date: daySummary.date,
                kcalLeft: daySummary.kcalLeft,
                kcalConsumed: daySummary.kcalConsumed,
                dailyRate: daySummary.dailyRate,
                percentsOfDailyRate: daySummary.percentsOfDailyRate,
                userId: daySummary.userId,
                id: daySummary._id,
            },
        });
    }

    if (!existingDay) {
        const newSummary = await Summary.create({
            date,
            kcalLeft: user.userData.dailyRate - kcalConsumed,
            kcalConsumed,
            dailyRate: user.userData.dailyRate,
            percentsOfDailyRate: (kcalConsumed * 100) / user.userData.dailyRate,
            userId: _id,
        });
        if (newSummary.kcalLeft < 0) {
            newSummary.kcalLeft = 0;
            newSummary.percentsOfDailyRate = 100;
            await newSummary.save();
        }
        const newDay = await SpecificDay.create({
            date,
            eatenProducts: [eatenProduct],
            daySummary: newSummary._id,
        });
        user.days.push(newDay._id);
        await user.save();
        
        return res.status(201).send({
          eatenProduct,
          day: {
              id: existingDay._id,
              eatenProducts: existingDay.eatenProducts,
              date: existingDay.date,
              daySummary: existingDay.daySummary,
          },
          daySummary: {
              date: daySummary.date,
              kcalLeft: daySummary.kcalLeft,
              kcalConsumed: daySummary.kcalConsumed,
              dailyRate: daySummary.dailyRate,
              percentsOfDailyRate: daySummary.percentsOfDailyRate,
              userId: daySummary.userId,
              id: daySummary._id,
          },
      });
    }
};

const getEatenProduct = async (req, res, next) => {
    const { date } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);

    const allDaysInfo = await Promise.all(user.days.map(dayId => Day.findById(dayId).exec()));

    const existingDay = allDaysInfo.find((day) => day.date === date);
    if (existingDay) {
        return res.status(201).send({
            eatenProducts: existingDay.eatenProducts,
        });
    };
    if (!existingDay) {
        return res.status(201).send({
            eatenProduct: [],
        });
    }
};

const deleteProduct = async (req, res) => {
    const { dayId, eatenProductId } = req.body;
    const day = await Day.findById(dayId);

    const nededDay = req.user.days.find((day) => day.toString() === dayId);
    if (!nededDay) {
        return res.status(404).send({ message: "Day not found" });
    }
    const product = day.eatenProducts.find((product) => product.id === eatenProductId);
    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }
    await Day.findByIdAndUpdate(dayId, { $pull: { eatenProducts: { id: eatenProductId } }, });
    
    const daySummary = await Summary.findById(day.daySummary);
    daySummary.kcalLeft += product.kcal;
    daySummary.kcalConsumed -= product.kcal;
    daySummary.percentsOfDailyRate = (daySummary.kcalConsumed * 100) / req.user.userData.dailyRate;
    if (daySummary.kcalLeft > req.user.userData.dailyRate) {
        daySummary.kcalLeft = req.user.userData.dailyRate;
    }
    await daySummary.save();
        return res.status(201).send({
            newDaySummary: {
                date: daySummary.date,
                kcalLeft: daySummary.kcalLeft,
                kcalConsumed: daySummary.kcalConsumed,
                dailyRate: daySummary.dailyRate,
                percentsOfDailyRate: daySummary.percentsOfDailyRate,
                userId: daySummary.userId,
                id: daySummary._id,
                },
        });
};

const addNewProduct = async (req, res, next) => {
    // const message = "Try to combine JSON"
    // combineJsonFile(message);
    const productName = req.body.title
    const checkItem = await Product.find({ 'title': { $regex: new RegExp('^' + productName, 'i') } });
    if (checkItem.length > 0) {
        return res.status(200).send({ message: "Such a product is already in the database" });
    }
    
    const newProduct = await Product.create({ ...req.body });
    if (Object.keys(newProduct).length) {
        return res.status(201).send({ message: "The product has been added to the database" });
    }
};

const getPeriodInfo = async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    const arrPeriodInfo = await Summary.find({ userId: _id });

    let kcalLeftTotal = user.userData.dailyRate;
    let kcalConsumedTotal = 0;
    let dailyRateTotal = user.userData.dailyRate;

    const periodDays = arrPeriodInfo.length;
    if (periodDays === 0) {
        return res.status(200).send({
            kcalLeft: kcalLeftTotal,
            kcalConsumed: kcalConsumedTotal,
            dailyRate: dailyRateTotal,
            percentsOfDailyRate: kcalConsumedTotal / dailyRateTotal, 
        });
    };

    if (periodDays > 0) {
        kcalLeftTotal = 0;
        kcalConsumedTotal = 0;
        dailyRateTotal = 0;
        for (let i = 0; i < periodDays; i += 1) {
        kcalLeftTotal += arrPeriodInfo[i].kcalLeft;
        kcalConsumedTotal += arrPeriodInfo[i].kcalConsumed;
        dailyRateTotal += arrPeriodInfo[i].dailyRate;
        };
        return res.status(200).send({
            kcalLeft: kcalLeftTotal / periodDays,
            kcalConsumed: kcalConsumedTotal / periodDays,
            dailyRate: dailyRateTotal / periodDays,
            percentsOfDailyRate: kcalConsumedTotal / dailyRateTotal, 
        });
    };
}

const getDayInfo = async (req, res, next) => {
  try {
    const { date } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const allDaysInfo = await Promise.all(user.days.map(dayId => SpecificDay.findById(dayId).exec()));

    const dayInfo = allDaysInfo.find(day => day && day.date === date);
    if (dayInfo) {
      const day = await SpecificDay.findById(dayInfo._id);
      if (!day) {
        return res.status(404).send({ message: "Day not found" });
      }

      const summary = await Summary.findById(day.daySummary);
      if (!summary) {
        return res.status(404).send({ message: "Summary not found" });
      }

      return res.status(200).send({
        id: day._id,
        eatenProducts: day.eatenProducts,
        date: day.date,
        daySummary: {
          date: summary.date,
          kcalLeft: summary.kcalLeft,
          kcalConsumed: summary.kcalConsumed,
          dailyRate: summary.dailyRate,
          percentsOfDailyRate: summary.percentsOfDailyRate,
          userId: summary.userId,
          id: summary._id,
        },
      });
    }

    return res.status(200).send({
      eatenProducts: [],
      date: date,
      daySummary: {
        date: date,
        kcalLeft: user.userData.dailyRate,
        kcalConsumed: 0,
        dailyRate: user.userData.dailyRate,
        percentsOfDailyRate: 0,
        userId: _id,
      },
    });
  } catch (error) {
    next(error);
  }
};


const checkDailyRate = async (req, res, next) => {
    if (!req.user.userData.dailyRate) {
        return res
        .status(403)
        .send({ message: "Please, count your daily rate first" });
    }
    next();
};

export {
    addProduct,
    getEatenProduct,
    deleteProduct,
    findProducts,
    checkDailyRate,
    getDayInfo,
    getPeriodInfo,
    addNewProduct
};