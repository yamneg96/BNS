import express from "express";
import { addDepartment, getAllDepartments, getAllUsers, } from "../controllers/supervisorController.js";

const router = express.Router();

/* USERS */
router.get("/users", getAllUsers);

/* DEPARTMENTS */
router.get("/", getAllDepartments);
router.post("/", addDepartment);
//router.delete("/:deptId", deleteDepartment);

/* WARDS */
//router.post("/:deptId/wards", addWard);
//router.delete("/:deptId/wards/:wardId", deleteWard);

/* ROOMS */
//router.post("/:deptId/wards/:wardId/rooms", addRoom);
//router.delete("/:deptId/wards/:wardId/rooms/:roomId", deleteRoom);

/* BEDS */
//router.post("/:deptId/wards/:wardId/rooms/:roomId/beds",addBed);
//router.delete("/:deptId/wards/:wardId/rooms/:roomId/beds/:bedId", deleteBed);

export default router;
