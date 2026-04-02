import mongoose from "mongoose";
import User from "../model/user.js";
import Workspace from "../model/workspace.js";
import WorkspaceMember from "../model/workspaceMember.js";
import Project from "../model/project.js";
import ProjectMember from "../model/projectMember.js";
import Task from "../model/task.js";

const { ObjectId } = mongoose.Types;
mongoose.connect('mongodb://127.0.0.1:27017/DevFlow_Collab');

async function seed() {
    await User.deleteMany({})
    await Workspace.deleteMany({})
    await WorkspaceMember.deleteMany({})
    await Project.deleteMany({})
    await ProjectMember.deleteMany({})
    await Task.deleteMany({})



    console.log("📡 Connected to MongoDB");

    // ============================
    // 1) USERS
    // ============================
    const users = [
        {
            _id: new ObjectId(),
            username: "alice",
            email: "alice@example.com",
            profileImg:
                "https://images.unsplash.com/photo-1413847394921-b259543f4872?q=80&w=1170&auto=format&fit=crop",
        },
        {
            _id: new ObjectId(),
            username: "bob",
            email: "bob@example.com",
        },
        {
            _id: new ObjectId(),
            username: "charlie",
            email: "charlie@example.com",
        },
    ];

    const getUser = (name) => users.find((u) => u.username === name)._id;

    // ============================
    // 2) WORKSPACES
    // ============================
    const workspaces = [
        {
            _id: new ObjectId(),
            workspaceName: "Team Alpha",
            owner: getUser("alice"),
        },
        {
            _id: new ObjectId(),
            workspaceName: "Design Crew",
            owner: getUser("bob"),
        },
    ];

    const getWorkspace = (name) =>
        workspaces.find((w) => w.workspaceName === name)._id;

    // ============================
    // 3) WORKSPACE MEMBERS
    // ============================
    const workspaceMembers = [
        // Team Alpha
        {
            _id: new ObjectId(),
            workspace: getWorkspace("Team Alpha"),
            user: getUser("alice"),
            role: "OWNER",
        },
        {
            _id: new ObjectId(),
            workspace: getWorkspace("Team Alpha"),
            user: getUser("bob"),
            role: "MEMBER",
            inviteBy: getUser("alice"),
        },

        // Design Crew
        {
            _id: new ObjectId(),
            workspace: getWorkspace("Design Crew"),
            user: getUser("bob"),
            role: "OWNER",
        },
        {
            _id: new ObjectId(),
            workspace: getWorkspace("Design Crew"),
            user: getUser("charlie"),
            role: "MEMBER",
            inviteBy: getUser("bob"),
        },
    ];

    // ============================
    // 4) PROJECTS
    // ============================
    const projects = [
        {
            _id: new ObjectId(),
            projectName: "Alpha Project",
            description: `알파 프로젝트는 차세대 데이터 분석 플랫폼 구축을 위한 프로토타입 개발 단계입니다.
핵심 목표는 실시간 데이터 시각화와 사용자 행동 로그 분석 엔진을 구축하는 것이며, 현재 요구사항 정의 및 와이어프레임 설계 단계에 있습니다. 
주요 기술 스택은 React, Node.js, 그리고 MongoDB를 활용할 예정입니다.`,
            status: "PLANNING",
            workspace: getWorkspace("Team Alpha"),
            owner: getUser("alice"),
            // 1. 현재 시간 기준 1주일 뒤로 설정할 때
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

            // 2. 특정 날짜를 고정해서 넣고 싶을 때 (연, 월-1, 일, 시, 분)
            // 주의: 월은 0부터 시작하므로 2월은 1입니다.
            // deadline: new Date(2026, 1, 28, 23, 59, 59),
        },
        {
            _id: new ObjectId(),
            projectName: "Design System",
            description: `팀 전체의 일관된 UI/UX 경험을 위해 디자인 시스템 고도화를 진행 중입니다. 
MUI 커스텀 테마를 기반으로 한 공통 컴포넌트 라이브러리(Storybook) 구축과 브랜드 가이드라인 수립을 목표로 합니다. 
현재 버튼, 입력 폼 등 기초 원자 단위 컴포넌트의 가이드라인 수립이 완료되어 개발 단계에 진입해 있습니다.`,
            status: "IN_PROGRESS",
            workspace: getWorkspace("Design Crew"),
            owner: getUser("bob"),
            // 1. 현재 시간 기준 1주일 뒤로 설정할 때
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

            // 2. 특정 날짜를 고정해서 넣고 싶을 때 (연, 월-1, 일, 시, 분)
            // 주의: 월은 0부터 시작하므로 2월은 1입니다.
            // deadline: new Date(2026, 1, 28, 23, 59, 59),
        },
    ];

    const getProject = (name) =>
        projects.find((p) => p.projectName === name)._id;

    // ============================
    // 5) PROJECT MEMBERS
    // ============================
    const projectMembers = [
        // Alpha Project
        {
            _id: new ObjectId(),
            project: getProject("Alpha Project"),
            user: getUser("alice"),
            role: "LEADER",
            lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60),
        },
        {
            _id: new ObjectId(),
            project: getProject("Alpha Project"),
            user: getUser("bob"),
            role: "MEMBER",
            lastAccessedAt: new Date(Date.now() - 1000 * 60 * 30),
        },

        // Design System
        {
            _id: new ObjectId(),
            project: getProject("Design System"),
            user: getUser("bob"),
            role: "LEADER",
        },
        {
            _id: new ObjectId(),
            project: getProject("Design System"),
            user: getUser("charlie"),
            role: "MEMBER",
        },
    ];

    // ============================
    // 6) TASKS
    // ============================
    const tasks = [
        {
            _id: new ObjectId(),
            taskName: "Create project structure",
            user: users[0]._id,
            project: projects[0]._id,
            userImportance: 'SUPPORT'
        },
        {
            _id: new ObjectId(),
            taskName: "Design UI components",
            user: users[1]._id,
            project: projects[1]._id,
            userImportance: 'OPERATIONAL'
        },
        {
            _id: new ObjectId(),
            taskName: "Database modeling",
            user: users[2]._id,
            project: projects[0]._id,
            userImportance: 'STRATEGIC'
        },
    ];

    // ============================
    // 7) INSERT (실제 데이터 삽입)
    // ============================
    console.log("🧹 Clearing existing documents...");
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await WorkspaceMember.deleteMany({});
    await Project.deleteMany({});
    await ProjectMember.deleteMany({});
    await Task.deleteMany({});

    console.log("📥 Inserting seed data...");

    await User.insertMany(users);
    await Workspace.insertMany(workspaces);
    await WorkspaceMember.insertMany(workspaceMembers);
    await Project.insertMany(projects);
    await ProjectMember.insertMany(projectMembers);
    await Task.insertMany(tasks);

    console.log("✅ Seeding completed!");

    process.exit();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});