import dayjs from 'dayjs'
import { z } from 'zod'

const signupSchema = z.object({
    username: z.string().min(1, 'username은 필수입니다.'),
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z.string().min(8, 'password는 8자 이상이어야 합니다.'),
    profileImg: z.array(z.file()).min(1)
})

const signinSchema = z.object({
    email: z.email('이메일 형식에 맞지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.')
})

const addProjectSchema = z.object({
    projectName: z
        .string()
        .min(1, '프로젝트 이름을 입력해주세요.')
        .max(50, '이름은 50자 이내로 입력해주세요.'),

    description: z
        .string()
        .min(5, '설명은 최소 5자 이상 입력해주세요.'),

    deadline: z
        .any() // DatePicker에서 오는 dayjs 객체를 받기 위해 any 혹은 custom 사용
        .refine((val) => val && dayjs(val).isValid(), {
            message: "유효한 날짜를 선택해주세요.",
        })
        .refine((val) => dayjs(val).isAfter(dayjs().subtract(1, 'day')), {
            message: "마감 기한은 오늘 이후여야 합니다.",
        }),
})

const editProjectSchema = z.object({
    projectName: z
        .string()
        .min(1, '프로젝트 이름을 입력해주세요.')
        .max(50, '이름은 50자 이내로 입력해주세요.'),

    description: z
        .string()
        .min(5, '설명은 최소 5자 이상 입력해주세요.'),

    deadline: z.any()
})

const addTaskSchema = z.object({
    taskName: z.string().min(1, '작업 이름을 입력해주세요.'),
    userImportance: z.enum(['SUPPORT', 'OPERATIONAL', 'STRATEGIC'])
})

const createWorkspace = z.object({
    workspaceName: z.string().min(1, '작업 공간의 이름을 입력해주세요.')
})

// Zod의 any() 사용 이유: 
// DatePicker가 반환하는 값은 순수 자바스크립트 Date 객체가 아니라 dayjs 객체입니다.
// z.date()를 쓰면 에러가 날 수 있기 때문에 any()로 받은 뒤 refine으로 실제 날짜인지 체크하는 것이 가장 안전합니다.

export {
    signupSchema, signinSchema,
    addProjectSchema, addTaskSchema,
    createWorkspace, editProjectSchema
}
