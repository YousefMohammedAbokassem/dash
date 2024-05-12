import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Divider, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { isFinite } from 'lodash';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const { rule } = useSelector((state) => state.auth);

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item, index) => {
          if ((item.title === 'user' || item.title === 'admin') && rule === 'admin') {
            return null;
          }

          return <NavItem key={index} item={item} />;
        })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const dispatch = useDispatch();

  const { title, path, icon, info } = item;

  const handleClick = () => {
    if (title === 'logout') {
      dispatch(logout());
    }
  };

  return (
    <div onClick={handleClick}>
      <StyledNavItem
        component={RouterLink}
        to={path}
        sx={{
          '&.active': {
            color: '#fff',
            bgcolor: 'warning.main',
            fontWeight: 'fontWeightBold',
          },
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

        <ListItemText disableTypography primary={title} />
      </StyledNavItem>
      {info &&
        info.map((element, index) => (
          <div key={index}>
            <StyledNavItem
              component={RouterLink}
              to={element.path}
              sx={{
                marginLeft: '20px',
              }}
            >
              <StyledNavItemIcon>{element.icon && element.icon}</StyledNavItemIcon>

              <ListItemText disableTypography primary={element.title} />
            </StyledNavItem>
          </div>
        ))}
      <Divider />
    </div>
  );
}
