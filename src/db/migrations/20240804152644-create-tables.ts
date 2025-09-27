import { QueryInterface } from 'sequelize';
import { USER_TABLE, UserSchema } from '../models/user.model';
import { ATTESTATION_TABLE, AttestationSchema } from '../models/attestation.model';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(ATTESTATION_TABLE, AttestationSchema);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ATTESTATION_TABLE);
  },
};
