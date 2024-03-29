'use strict';

const {user, team, userteam, reflection, feedback} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // user table & team data
    const users = [
      {
        username: 'Mary',
        email: 'mary@apple.com'
      },
      {
        username: 'Ginger',
        email: 'ginger@apple.com'
      },
      {
        username: 'Hoya',
        email: 'hoya@apple.com'
      },
      {
        username: 'Chemi',
        email: 'chemi@apple.com'
      },
      {
        username: 'Id',
        email: 'id@apple.com'
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

    // user table & team insert data
    const userId1 = await queryInterface.bulkInsert("user", users, { returning: ["id"]});
    const teamId1 = await queryInterface.bulkInsert("team", teams, { returning: ["id"]});

    // usertoken data
    const usertokens = [
      {
        refresh_token: 'mary_refresh_token',
        user_id: userId1
      },
      {
        refresh_token: 'ginger_refresh_token',
        user_id: userId1 + 1
      },
      {
        refresh_token: 'hoya_refresh_token',
        user_id: userId1 + 2
      },
      {
        refresh_token: 'chemi_refresh_token',
        user_id: userId1 + 3
      },
      {
        refresh_token: 'id_refresh_token',
        user_id: userId1 + 4
      },
    ]
    // usertoken insert data
    await queryInterface.bulkInsert('usertoken', usertokens);

    // userteam data
    const userteams = [
      {
        user_id: userId1,
        team_id: teamId1,
        nickname: '메리',
        role: '백엔드 개발자'
      },
      {
        user_id: userId1 + 1,
        team_id: teamId1,
        nickname: '진저',
        role: 'PM, iOS 개발자, 디자이너'
      },
      {
        user_id: userId1 + 2,
        team_id: teamId1,
        nickname: '호야',
        role: 'iOS 개발자, 팀 관리자'
      },
      {
        user_id: userId1 + 3,
        team_id: teamId1,
        nickname: '케미',
        role: 'iOS 개발 리드'
      },
      {
        user_id: userId1 + 4,
        team_id: teamId1,
        nickname: '이드',
        role: 'iOS 개발자, 디자이너'
      },
      {
        user_id: userId1 + 3,
        team_id: teamId1 + 1,
        nickname: '케미',
        role: 'iOS 개발 리드'
      },
      {
        user_id: userId1 + 4,
        team_id: teamId1 + 1,
        nickname: '이드',
        role: 'iOS 개발자, 디자이너'
      }
    ]
    // userteam insert data
    await queryInterface.bulkInsert('userteam', userteams);

    // reflection data
    const reflections = [
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
    ]

    // reflection data insert
    const reflectionId1 = await queryInterface.bulkInsert('reflection', reflections);

    // team current, recent_reflection_id update
    await team.update({
      current_reflection_id : reflectionId1 + 1,
      recent_reflection_id : reflectionId1
    },
    {
      where : {
        team_name: '맛쟁이사과처럼'
      }
    });

    await team.update({
      current_reflection_id : reflectionId1 + 2,
    },
    {
      where : {
        team_name: 'Academy🍎'
      }
    });

    // feedback data
    const feedbacks = [
      {
        from_id: userId1,
        to_id: userId1 + 1,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1,
        to_id: userId1 + 1,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Stop",
        keyword: "s",
        content: "그만하기"
      },
      {
        from_id: userId1,
        to_id: userId1 + 2,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 1,
        to_id: userId1 + 2,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Stop",
        keyword: "s",
        content: "멈추기"
      },
      {
        from_id: userId1 + 1,
        to_id: userId1,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 3,
        to_id: userId1 + 4,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Stop",
        keyword: "s",
        content: "멈추기"
      },
      {
        from_id: userId1 + 4,
        to_id: userId1 + 3,
        team_id: teamId1,
        reflection_id: reflectionId1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1,
        to_id: userId1 + 1,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1,
        to_id: userId1 + 1,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Stop",
        keyword: "s",
        content: "그만하기"
      },
      {
        from_id: userId1,
        to_id: userId1 + 2,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 1,
        to_id: userId1 + 2,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Stop",
        keyword: "s",
        content: "멈추기"
      },
      {
        from_id: userId1 + 1,
        to_id: userId1,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 3,
        to_id: userId1 + 4,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Stop",
        keyword: "s",
        content: "멈추기"
      },
      {
        from_id: userId1 + 4,
        to_id: userId1 + 3,
        team_id: teamId1,
        reflection_id: reflectionId1 + 1,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 4,
        to_id: userId1 + 3,
        team_id: teamId1 + 1,
        reflection_id: reflectionId1 + 2,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      },
      {
        from_id: userId1 + 4,
        to_id: userId1 + 3,
        team_id: teamId1 + 1,
        reflection_id: reflectionId1 + 2,
        type: "Stop",
        keyword: "s",
        content: "그만하기"
      },      
      {
        from_id: userId1 + 3,
        to_id: userId1 + 4,
        team_id: teamId1 + 1,
        reflection_id: reflectionId1 + 2,
        type: "Continue",
        keyword: "c",
        content: "지속하기"
      }      
    ]

    // feedback insert data
    await queryInterface.bulkInsert('feedback', feedbacks);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkDelete('team', null, {});
    await queryInterface.bulkDelete('userteam', null, {});
    await queryInterface.bulkDelete('reflection', null, {});
    await queryInterface.bulkDelete('feedback', null, {});
  }
};