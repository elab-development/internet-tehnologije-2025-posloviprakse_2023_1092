/**
 * Master Controllers Index
 * Kombinuje sve kontrolere u jedno mesto za lakši import
 * 
 * Korišćenje:
 * import { authControllers, jobControllers, ... } from '../controllers/index.js'
 */

import * as authControllers from './authController.js';
import * as jobControllers from './jobController.js';
import * as companyControllers from './companyController.js';
import * as studentControllers from './studentController.js';
import * as applicationControllers from './applicationController.js';
import * as reviewControllers from './reviewController.js';
import * as adminControllers from './adminController.js';

export {
  authControllers,
  jobControllers,
  companyControllers,
  studentControllers,
  applicationControllers,
  reviewControllers,
  adminControllers
};

// Ako želiš direktan pristup funkcijama:
export * from './authController.js';
export * from './jobController.js';
export * from './companyController.js';
export * from './studentController.js';
export * from './applicationController.js';
export * from './reviewController.js';
export * from './adminController.js';
