import { useMemo, useState } from 'react';
import { ArrowDropDown, Search } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

type LanguageOption = {
  value: string;
  label: string;
};

type LanguageSelectProps = {
  value: string;
  options: readonly LanguageOption[];
  onValueChange: (value: string) => void;
  currentLabel: string;
};

export const LanguageSelect = ({
  value,
  options,
  onValueChange,
  currentLabel,
}: LanguageSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const open = Boolean(anchorEl);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower),
    );
  }, [search, options]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch('');
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        endIcon={<ArrowDropDown />}
        contentEditable={false}
        sx={{
          textTransform: 'none',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          minWidth: 'auto',
          px: 1.5,
          py: 0.5,
        }}>
        {currentLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 256,
            maxHeight: 300,
            mt: 0.5,
          },
        }}
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        <Box sx={{ p: 1 }}>
          <TextField
            placeholder="Search language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
            }}>
            {filteredOptions.length === 0 ? (
              <Box sx={{ px: 2, py: 2, textAlign: 'center', color: 'text.secondary' }}>
                No languages found
              </Box>
            ) : (
              filteredOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  selected={value === option.value}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    py: 1,
                  }}>
                  {option.label}
                </MenuItem>
              ))
            )}
          </Box>
        </Box>
      </Menu>
    </>
  );
};
