import { ListItemButton, ListItemText } from "@mui/material";
import { useProjectStore } from "../../../store/useProjectStore";
import { useNavigate, useParams } from "react-router-dom";


export default function Element({ project }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const getSelectedProjectInWorkspace = useProjectStore(state => state.getSelectedProjectInWorkspace)
    const selectedProjectInWorkspace = useProjectStore(state => state.selectedProjectInWorkspace)

    const handleClick = async (projectId) => {
        await getSelectedProjectInWorkspace(projectId)
        navigate(`/workspace/${id}`)
    }

    return (
        <ListItemButton
            onClick={() => handleClick(project._id)}
            selected={selectedProjectInWorkspace?._id === project._id}
            sx={{
                color: '#ccc', // 기본 텍스트 색상
                transition: 'all 0.2s',
                mx: 2,
                borderRadius: '12px',
                // 1. 선택되었을 때 (눌린 상태)
                '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.25)', // 배경 보라색이 비치는 어두운 영역
                    color: '#fff', // 선택 시 텍스트는 밝게

                    // 🔥 선택된 상태에서 마우스를 올려도 색상 유지
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.25)',
                    }
                },

                // 2. 선택되지 않았을 때 마우스를 올리면 살짝 밝게 (피드백)
                '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff'
                }
            }}
        >
            <ListItemText
                primary={project.projectName}
                slotProps={{
                    primary: {
                        textAlign: 'center'
                    }
                }}
            />
        </ListItemButton>

    )
}