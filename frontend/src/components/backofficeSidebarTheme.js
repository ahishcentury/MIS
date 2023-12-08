import { createTheme } from '@mui/material/styles';

const sidebarTheme = createTheme({
    components:{
      MuiTabs:{
        defaultProps:{
          TabIndicatorProps:{
            style:{
              borderTopLeftRadius:'3px',
              borderBottomLeftRadius:'3px',
              width:'3px'
            }
          }
        },
      },
      MuiTab:{
        styleOverrides:{
          root:{
            textTransform:'none',
            fontWeight:600,
          fontFamily:`'Open Sans', sans-serif`,
            "&.Mui-selected": {
              "backgroundColor": 'whitesmoke'
            }
          },
          
        }
      },
    }
  });

  export default sidebarTheme;