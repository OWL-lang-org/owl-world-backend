import { Sequelize } from "sequelize";
import { User, UserSchema } from "./user.model";
import { Attestation, AttestationSchema } from "./attestation.model";

function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Attestation.init(AttestationSchema, Attestation.config(sequelize));

  User.associate(sequelize.models);
  Attestation.associate(sequelize.models);
}

export default setupModels;
