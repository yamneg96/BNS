import mongoose from "mongoose";
import Department from "../models/Department.js";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";


const areSameBeds = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.map(Number).sort().join(",") === b.map(Number).sort().join(",");
};
