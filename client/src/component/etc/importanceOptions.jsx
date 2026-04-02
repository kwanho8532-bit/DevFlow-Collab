import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const getImportanceOptions = (value) => {
    switch (value) {
        case 'STRATEGIC':
            return { icon: <KeyboardDoubleArrowUpIcon />, label: 'STRATEGIC', color: '#7C3AED' }
        case 'OPERATIONAL':
            return { icon: <HorizontalRuleIcon />, label: 'OPERATIONAL', color: '#3B82F6' }
        default:
            return { icon: <KeyboardArrowDownIcon />, label: 'SUPPORT', color: '#10B981' }

    }
}

export const importanceOptions = [
    { label: 'STRATEGIC', color: '#7C3AED' },
    { label: 'OPERATIONAL', color: '#3B82F6' },
    { label: 'SUPPORT', color: '#10B981' }
]

export const importanceRGB = {
    'STRATEGIC': 'rgb(124, 58, 237)',
    'OPERATIONAL': 'rgb(59, 130, 246)',
    'SUPPORT': 'rgb(16, 185, 129)'
}

export const importanceRGBA = {
    'STRATEGIC': 'rgba(124, 58, 237, 0.15)',
    'OPERATIONAL': 'rgba(59, 130, 246, 0.15)',
    'SUPPORT': 'rgba(16, 185, 129, 0.15)'
}