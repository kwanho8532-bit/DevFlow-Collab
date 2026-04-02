import Project from "../model/project.js"
import ProjectMember from "../model/projectMember.js"


export const createProject = async (data) => {
    if (data) {
        const newProject = await new Project(data).save()
        return newProject
    } else {
        throw new Error('프로젝트 생성에 실패하였습니다.')
    }
}

export const createProjectMember = async (data) => {
    if (data) {
        const newProjectMember = await new ProjectMember(data).save()
        return newProjectMember.populate('project')
    } else {
        throw new Error('프로젝트 멤버 생성에 실패하였습니다.')
    }
}

export const projectDelete = async (projectId) => {
    if (projectId) {
        const deleted = await Project.findByIdAndDelete(projectId)
        return deleted
    } else {
        throw new Error('프로젝트 아이디가 존재하지 않습니다.')
    }
}

export const findProjectMembers = async (userId) => {
    const projects = await ProjectMember.find({ user: userId })
        .populate({
            path: 'project',
            populate: {
                path: 'owner'
            }
        })
    return projects
}

export const getArchivedProjects = async (projects) => {
    if (projects.length) {
        const archived = projects
            .filter(pm => pm.project.archivedAt !== null)
            .map(pm => pm.project)
        return archived
    } else {
        throw new Error('프로젝트 자체가 존재하지 않습니다.')
    }
}

export const findProject = async (projectId) => {
    const project = await Project.findById(projectId).populate('owner')
    return project
}

export const updateProjectStatus = async (status, project) => {
    if (status === 'ARCHIVED') {
        project.archivedAt = Date.now()
    } else {
        project.changeStatus(status)
    }
}

export const projectModify = async (projectId, { projectName, description, deadline }) => {
    const target = await Project.findByIdAndUpdate(projectId, {
        projectName,
        description,
        deadline
    }, { returnDocument: 'after' }).populate('owner')

    return target
}

export const archive = async (projectId) => {
    const targetProject = await Project.findByIdAndUpdate(projectId, {
        archivedAt: Date.now()
    }, { returnDocument: 'after' })
    return targetProject
}

export const unarchive = async (projectId) => {
    const targetProject = await Project.findByIdAndUpdate(projectId, {
        archivedAt: null
    }, { returnDocument: 'after' }).populate('owner')
    return targetProject
}

export const findProjectsByWorkspaceId = async (workspaceId) => {
    const projects = await Project.find({ workspace: workspaceId }).populate('owner')
    return projects
}

export const createProjectWithWorkspace = async (workspaceId, userId, { projectName, description, deadline }) => {
    const project = await new Project({
        projectName,
        description,
        deadline,
        status: 'PLANNING',
        workspace: workspaceId,
        owner: userId,
    }).save()
    return project
}