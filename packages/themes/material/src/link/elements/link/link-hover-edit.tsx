import { Delete as DeleteIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type LinkHoverEditProps = {
  textInputRef: React.RefObject<HTMLInputElement>;
  urlInputRef: React.RefObject<HTMLInputElement>;
  editedText: string;
  editedUrl: string;
  onChangeLinkText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLinkUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  saveEdit: (e: React.MouseEvent) => void;
  cancelEdit: (e: React.MouseEvent) => void;
  deleteLink: (e: React.MouseEvent) => void;
};

const LinkHoverEdit = ({
  textInputRef,
  urlInputRef,
  editedText,
  editedUrl,
  onChangeLinkText,
  onChangeLinkUrl,
  onKeyDown,
  saveEdit,
  cancelEdit,
  deleteLink,
}: LinkHoverEditProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
          Link text
        </Typography>
        <TextField
          inputRef={textInputRef}
          value={editedText}
          onChange={onChangeLinkText}
          placeholder="Link text..."
          size="small"
          fullWidth
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
          URL
        </Typography>
        <TextField
          inputRef={urlInputRef}
          value={editedUrl}
          onChange={onChangeLinkUrl}
          onKeyDown={onKeyDown}
          placeholder="Enter URL..."
          size="small"
          fullWidth
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button size="small" variant="contained" onClick={saveEdit} sx={{ fontSize: '0.75rem' }}>
            Save
          </Button>
          <Button size="small" variant="text" onClick={cancelEdit} sx={{ fontSize: '0.75rem' }}>
            Cancel
          </Button>
        </Box>
        <IconButton
          size="small"
          onClick={deleteLink}
          sx={{
            width: 28,
            height: 28,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export { LinkHoverEdit };
