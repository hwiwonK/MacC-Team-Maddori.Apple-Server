'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const users = [
      {
        username: 'Mary'
      },
      {
        username: 'Ginger'
      },
      {
        username: 'Hoya'
      },
      {
        username: 'Chemi'
      },
      {
        username: 'Id'
      }
    ]

    const teams = [
      {
        team_name: '맛쟁이사과처럼',
        invitation_code: "123ABC",
      },
      {
        team_name: 'Academy🍎',
        invitation_code: "456DEF",
      }
    ]

    // user table & team table
    const userId1 = await queryInterface.bulkInsert("user", users, { returning: ["id"]});
    const teamId1 = await queryInterface.bulkInsert("team", teams, { returning: ["id"]});

    

    // userteam table
    await queryInterface.bulkInsert('userteam', [
      {
        user_id: userId1,
        team_id: teamId1,
        admin: true
      },
      {
        user_id: userId1 + 1,
        team_id: teamId1,
        admin: false
      },
      {
        user_id: userId1 + 2,
        team_id: teamId1,
        admin: false
      },
      {
        user_id: userId1 + 3,
        team_id: teamId1 + 1,
        admin: false
      },
      {
        user_id: userId1 + 4,
        team_id: teamId1 + 1,
        admin:true
      },
    ]);

    // reflection table
    await queryInterface.bulkInsert('reflection', [
      {
        team_id: teamId1,
        reflection_name: '맛쟁이사과처럼 sprint1',
        date: "2022.10.28",
        state: "Done"
      },
      {
        team_id: teamId1,
        reflection_name: '맛쟁이사과처럼 sprint2',
        state: "SettingRequired"
      },
      {
        team_id: teamId1 + 1,
        reflection_name: '아카데미 sprint1',
        date: "2022.11.5",
        state: "Before"
      }
    ]);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkDelete('team', null, {});
    await queryInterface.bulkDelete('userteam', null, {});
    await queryInterface.bulkDelete('reflection', null, {});
  }
};