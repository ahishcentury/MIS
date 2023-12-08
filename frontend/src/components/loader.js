import { CircularProgress,Box } from "@mui/material";

export default function Loader(props){
    const {msg,size=24,marginBottom=0,marginTop=0} = props;

    return <Box sx={{
        position:'absolute',
        display:'flex',
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center',
        top:0,
        left:0,
        background:'rgba(256,256,256,0.5)',
        width:'100%',
        height:'100%',
        zIndex:100}}>

            <CircularProgress disableShrink size={size} sx={{marginBottom,marginTop}}/>
            <h5>{msg}</h5>
    </Box>
}