import {
    createProject, createProjectMember,
    projectDelete, findProject,
    findProjectMembers, getArchivedProjects,
    archive, unarchive,
    updateProjectStatus, projectModify,
    findProjectsByWorkspaceId,
    createProjectWithWorkspace
} from "../services/project.js";
import catchAsync from "../utils/catchAsync.js";


export const newProjectAndProjectMember = catchAsync(async function (req, res, next) {
    let newProject = null

    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: '로그인이 필요합니다.'
            })
        }

        const { projectName, description, deadline } = req.body
        const user = req.user

        const projectData = {
            projectName,
            description,
            status: 'PLANNING',
            workspace: null,
            owner: user._id,
            createAt: Date.now(),
            deadline
        }
        newProject = await createProject(projectData)

        const projectMemberData = {
            project: newProject._id,
            user: user._id,
            lastAccessedAt: Date.now(),
            role: 'LEADER'
        }
        const newProjectMember = await createProjectMember(projectMemberData)

        res.status(200).json(newProjectMember)
    } catch (err) {
        if (newProject) {
            await projectDelete(newProject._id)
        }
    }
})

export const getArchived = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const projects = await findProjectMembers(req.user._id)
    const archivedProjects = await getArchivedProjects(projects)

    res.status(200).json(archivedProjects)
})

export const projectDetail = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params
    const project = await findProject(projectId)

    res.status(200).json(project)
})

export const updateStatus = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }


    const { projectId } = req.params
    const { status } = req.body

    const project = await findProject(projectId)

    if (!req.user._id.equals(project.owner._id)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }

    await updateProjectStatus(status, project)
    await project.save()
    res.status(200).json(project)
})

export const editProject = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params
    const project = await findProject(projectId)


    if (!req.user._id.equals(project.owner._id)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }

    const modyfied = await projectModify(projectId, req.body)

    res.status(200).json(modyfied)
})

export const deleteProject = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params
    const project = await findProject(projectId)


    if (!req.user._id.equals(project.owner._id)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }

    const targetProject = await projectDelete(projectId)
    res.status(200).json(targetProject)
})

export const archiving = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params
    const project = await findProject(projectId)


    if (!req.user._id.equals(project.owner._id)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }

    const targetProject = await archive(projectId)

    res.status(200).json(targetProject)
})

export const unarchiving = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params
    const project = await findProject(projectId)


    if (!req.user._id.equals(project.owner._id)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }

    const targetProject = await unarchive(projectId)

    res.status(200).json(targetProject)
})

export const getProjectByWorkspace = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { workspaceId } = req.params

    const projects = await findProjectsByWorkspaceId(workspaceId)

    res.status(200).json(projects)
})

export const createProjectForWorkspace = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { workspaceId } = req.params
    const user = req.user

    const project = await createProjectWithWorkspace(workspaceId, user._id, req.body)

    const projectMemberData = {
        project: project._id,
        user: user._id,
        lastAccessedAt: Date.now(),
        role: 'LEADER'
    }

    const projectMember = await createProjectMember(projectMemberData)

    // 기존 projectsInSelectedWorkspace가 projectMember의 배열이 아닌
    // project의 배열이라서 project를 넘김
    const sendData = await project.populate('owner')

    res.status(200).json(sendData)
})
