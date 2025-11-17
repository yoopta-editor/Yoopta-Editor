import React from 'react';
import { render, screen } from '@testing-library/react';
import { SlashActionMenuList } from './slash-action-menu-list';
import type { ActionMenuItem } from '../action-menu-list/types';

describe('SlashActionMenuList Components', () => {
  const mockAction: ActionMenuItem = {
    type: 'Paragraph',
    title: 'Paragraph',
    description: 'Just start typing with plain text.',
  };

  describe('SlashActionMenuList.Root', () => {
    it('should render children', () => {
      render(
        <SlashActionMenuList.Root data-testid="root">
          <div>Test Content</div>
        </SlashActionMenuList.Root>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red', padding: '20px' };

      render(
        <SlashActionMenuList.Root data-testid="root" style={customStyle}>
          Content
        </SlashActionMenuList.Root>,
      );

      const root = screen.getByTestId('root');
      expect(root).toHaveStyle('background-color: red');
      expect(root).toHaveStyle('padding: 20px');
    });

    it('should have correct role attribute', () => {
      render(<SlashActionMenuList.Root data-testid="root">Content</SlashActionMenuList.Root>);

      expect(screen.getByTestId('root')).toHaveAttribute('role', 'listbox');
    });

    it('should stop event propagation on mouse events', () => {
      const mockOnClick = vi.fn();
      const mockOnMouseDown = vi.fn();

      const { container } = render(
        <div onClick={mockOnClick} onMouseDown={mockOnMouseDown}>
          <SlashActionMenuList.Root data-testid="root">Content</SlashActionMenuList.Root>
        </div>,
      );

      const root = screen.getByTestId('root');

      root.click();
      expect(mockOnClick).not.toHaveBeenCalled();

      root.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(mockOnMouseDown).not.toHaveBeenCalled();
    });
  });

  describe('SlashActionMenuList.Group', () => {
    it('should render children', () => {
      render(
        <SlashActionMenuList.Group data-testid="group">
          <div>Group Content</div>
        </SlashActionMenuList.Group>,
      );

      expect(screen.getByTestId('group')).toBeInTheDocument();
      expect(screen.getByText('Group Content')).toBeInTheDocument();
    });

    it('should apply correct CSS class', () => {
      render(<SlashActionMenuList.Group data-testid="group">Content</SlashActionMenuList.Group>);

      expect(screen.getByTestId('group')).toHaveClass('yoopta-ui-slash-action-menu-list-group');
    });
  });

  describe('SlashActionMenuList.Item', () => {
    it('should render action title', () => {
      render(<SlashActionMenuList.Item action={mockAction} data-testid="item" />);

      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('should render action description when provided', () => {
      render(<SlashActionMenuList.Item action={mockAction} data-testid="item" />);

      expect(screen.getByText('Just start typing with plain text.')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const actionWithoutDesc: ActionMenuItem = {
        type: 'Divider',
        title: 'Divider',
      };

      const { container } = render(
        <SlashActionMenuList.Item action={actionWithoutDesc} data-testid="item" />,
      );

      expect(
        container.querySelector('.yoopta-ui-slash-action-menu-list-item-description'),
      ).not.toBeInTheDocument();
    });

    it('should apply selected class when selected', () => {
      render(<SlashActionMenuList.Item action={mockAction} selected={true} data-testid="item" />);

      expect(screen.getByTestId('item')).toHaveClass('selected');
    });

    it('should not apply selected class when not selected', () => {
      render(<SlashActionMenuList.Item action={mockAction} selected={false} data-testid="item" />);

      expect(screen.getByTestId('item')).not.toHaveClass('selected');
    });

    it('should render icon when provided as ReactElement', () => {
      const IconComponent = () => <svg data-testid="icon">Icon</svg>;

      render(
        <SlashActionMenuList.Item
          action={mockAction}
          icon={<IconComponent />}
          data-testid="item"
        />,
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render icon when provided as string (URL)', () => {
      render(
        <SlashActionMenuList.Item
          action={mockAction}
          icon="https://example.com/icon.png"
          data-testid="item"
        />,
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/icon.png');
      expect(img).toHaveAttribute('alt', 'icon');
    });

    it('should not render icon container when icon is not provided', () => {
      const { container } = render(
        <SlashActionMenuList.Item action={mockAction} data-testid="item" />,
      );

      expect(
        container.querySelector('.yoopta-ui-slash-action-menu-list-item-icon'),
      ).not.toBeInTheDocument();
    });

    it('should have button type', () => {
      render(<SlashActionMenuList.Item action={mockAction} data-testid="item" />);

      expect(screen.getByTestId('item')).toHaveAttribute('type', 'button');
    });
  });

  describe('SlashActionMenuList.Empty', () => {
    it('should render default empty message', () => {
      render(<SlashActionMenuList.Empty />);

      expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('should apply correct CSS class', () => {
      const { container } = render(<SlashActionMenuList.Empty />);

      expect(container.firstChild).toHaveClass('yoopta-ui-slash-action-menu-list-empty');
    });
  });

  describe('Integration', () => {
    it('should render complete menu structure', () => {
      const actions: ActionMenuItem[] = [
        { type: 'Paragraph', title: 'Paragraph', description: 'Plain text' },
        { type: 'HeadingOne', title: 'Heading 1', description: 'Big heading' },
        { type: 'HeadingTwo', title: 'Heading 2', description: 'Medium heading' },
      ];

      render(
        <SlashActionMenuList.Root data-testid="root">
          <SlashActionMenuList.Group>
            {actions.map((action) => (
              <SlashActionMenuList.Item
                key={action.type}
                action={action}
                selected={action.type === 'Paragraph'}
              />
            ))}
          </SlashActionMenuList.Group>
        </SlashActionMenuList.Root>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Heading 2')).toBeInTheDocument();
      expect(screen.getByText('Plain text')).toBeInTheDocument();
      expect(screen.getByText('Big heading')).toBeInTheDocument();
      expect(screen.getByText('Medium heading')).toBeInTheDocument();
    });

    it('should render empty state when no actions', () => {
      const actions: ActionMenuItem[] = [];

      render(
        <SlashActionMenuList.Root data-testid="root">
          <SlashActionMenuList.Group>
            {actions.length === 0 ? (
              <SlashActionMenuList.Empty />
            ) : (
              actions.map((action) => (
                <SlashActionMenuList.Item key={action.type} action={action} />
              ))
            )}
          </SlashActionMenuList.Group>
        </SlashActionMenuList.Root>,
      );

      expect(screen.getByText('No results')).toBeInTheDocument();
    });
  });
});
