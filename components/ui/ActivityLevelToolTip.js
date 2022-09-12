import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { Tooltip, tooltipClasses, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useState } from 'react'

export default function ActitiyLevelTooltip() {
  const [open, setOpen] = useState(false)
  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const activityOptions = [
    'Basal Metabolic rate',
    'Sedentary: Little or no exercise',
    'Light: Exercise 1-3 times/week',
    'Moderate: exercise 4-5 times/week',
    'Active: Daily exercise or intense exercise 3-4 times/week',
    'Very Active: intense exercise 6-7 time/week',
    'Extra Active: very intense exercise daily, or physical job',
  ]

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      {...props}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <HtmlTooltip
          title={
            <>
              <Typography color="inherit">Activity level options</Typography>
              <ul>
                {activityOptions.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </>
          }
        >
          <QuestionMarkCircleIcon onClick={handleTooltipOpen} className="h-5" />
        </HtmlTooltip>
      </div>
    </ClickAwayListener>
  )
}
