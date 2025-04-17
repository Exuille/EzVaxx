import Vaccine from '../models/vaccineModel.js';
import catchAsync from '../utils/catchAsync.js';

export const createVaccine = catchAsync(async (req, res) => {
    const { name, type, manufacturer, stock, expirationDate } = req.body;
  
    if (!name || !type || !manufacturer || !stock || !expirationDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields: name, type, manufacturer, stock, expirationDate',
      });
    }
  
    const existingVaccine = await Vaccine.findOne({ name, type, expirationDate });
  
    if (existingVaccine) {
      // Update stock
      existingVaccine.stock += Number(stock); // make sure stock is treated as a number
      await existingVaccine.save();
  
      return res.status(200).json({
        status: 'success',
        message: 'Existing vaccine updated with new stock',
        data: {
          vaccine: existingVaccine,
        },
      });
    }

    const newVaccine = await Vaccine.create(req.body);
  
    res.status(201).json({
      status: 'success',
      message: 'New vaccine created',
      data: {
        vaccine: newVaccine,
      },
    });
  });
  

export const getVaccines = catchAsync(async (req, res) => {
    const vaccines = await Vaccine.find();
    res.status(200).json({
        status: 'success',
        results: vaccines.length,
        data: {
            vaccines,
        },
    });
});

export const getVaccineById = catchAsync(async (req, res) => {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
        return res.status(404).json({
            status: 'fail',
            message: 'Vaccine not found',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            vaccine,
        },
    });
});

export const updateVaccine = catchAsync(async (req, res) => {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!vaccine) {
        return res.status(404).json({
            status: 'fail',
            message: 'Vaccine not found',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            vaccine,
        },
    });
});

export const deleteVaccine = catchAsync(async (req, res) => {
    const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
    if (!vaccine) {
        return res.status(404).json({
            status: 'fail',
            message: 'Vaccine not found',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
