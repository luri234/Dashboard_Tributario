import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { Option } from '../../types/dashboard'

interface Props<T extends string | number> {
  id: string
  label: string
  allLabel: string
  value: T | null
  options: Option<T>[]
  onChange: (value: T | null) => void
}

export function FilterSelect<T extends string | number>({
  id, label, allLabel, value, options, onChange,
}: Props<T>) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={label}
        value={value === null ? '' : String(value)}
        onChange={(event) => {
          const chosen = options.find((option) => String(option.value) === event.target.value)
          onChange(chosen?.value ?? null)
        }}
        sx={{ bgcolor: 'background.paper' }}
      >
        <MenuItem value="">{allLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={String(option.value)}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
