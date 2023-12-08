import React, { useState, useRef, useContext, useEffect } from 'react';
import { Table, Space, Input, Tooltip, List, Switch,Card, Select } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, Dialog, Typography, Toolbar, AppBar, IconButton, Divider, Grid } from '@mui/material';
import AppContext from '../../../AppContext';
import moment from 'moment'
import { UPDATE_USER_MODULE_ACCESS} from '../../../helpers/superAdminApiStrings';
import { axiosWithHeader as axios } from '../../../helpers/axiosConfig';
import NewRoleDialog from './newRoleDialog';
import UpdatableTextFieldANTD from '../commonComponents.js/editableTableTextComponent';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PermissionsDialog(props) {
    const { open, onClose, roleName,roleId, perms } = props;

    const appContext = useContext(AppContext);

    const [mods, setMods] = useState(getMods(perms));

    function getMods(mods) {
        let temp = [];
        for (let key in mods) {
            temp.push({
                title: key,
                view: mods[key].ops[0],
                edit: mods[key].ops[1],
                delete: mods[key].ops[2],
                fields: mods[key].fields
            });
        }

        return temp;
    }

    const columns = [
        { title: "Module", dataIndex: 'title' },
        { title: "View", render: (data) => <ModuleAccess roleId={roleId} accessLevel={0} module={data.title} hasAccess={data.view} />},
        { title: "Create/Edit", render: (data) => <ModuleAccess roleId={roleId} accessLevel={1} module={data.title} hasAccess={data.edit} /> },
        { title: "Delete", render: (data) => <ModuleAccess roleId={roleId} accessLevel={2} module={data.title} hasAccess={data.delete}/> },

    ]

   

    return <Dialog open={open} onClose={onClose} fullScreen TransitionComponent={Transition}>
      
        <Box pl={2} pr={2} sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>

            
            <Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </Box>
            <Box>
                <Box>
                    <h2>{roleName}</h2>
                </Box>
            </Box>
            <span>(Permissions)</span>
        </Box>
        <Divider />
        <Box p={4}>
            <Table
                bordered
                rowKey={'title'}
                expandable={{
                    expandedRowRender: (record) => <FieldsComponent {...record} />

                }}
                dataSource={mods}
                columns={columns} />
        </Box>
    </Dialog>
}


function ModuleAccess(props){

    const appContext = useContext(AppContext);
    const { module, hasAccess,accessLevel,roleId} = props;
    const [isUpdating,setIsUpdating] = useState(false);
    const [isChecked,setIsChecked] = useState(Boolean(hasAccess));

    function onChange(newVal){
       console.log("New Val",newVal);
        let x = null;

       if(newVal){
        x = 1;
       }else{
        x = 0;
       }
        setIsUpdating(true);
        axios.post(UPDATE_USER_MODULE_ACCESS,{module,hasAccess:x,roleId,accessLevel})
        .then(res=>{
            setIsChecked(newVal);

            setIsUpdating(false);
            appContext.setSeverity("success");
            appContext.setSnackbarMsg(appContext.getString("updated"));
        }).catch(e=>{
           setIsChecked(isChecked)
            setIsUpdating(false);
            appContext.setSeverity("error");
            appContext.setSnackbarMsg(appContext.getString("errorOccured"));
        })
    }

    return <Switch loading={isUpdating} onChange={onChange} checked={isChecked}   />
}

function FieldsComponent(props) {
    const { fields } = props;
    const [items, setItems] = useState(getColumns(fields));

    const columns = [
        { title: "Field", dataIndex: 'title' },
        { title: "Status", render: (row) => <FieldPermissionComponent level={row.status} /> }
    ]
    function getColumns(fields) {
        let temp = [];

        for (let key in fields) {
            temp.push({
                title: fields[key][0],
                status: fields[key][1],
            });
        }

        return temp;
    }

  

    return <Card
    bodyStyle={{padding:0}}
    title="Fields"
    headStyle={{backgroundColor:'whitesmoke'}}
    extra={<Space></Space>}
    
  >
    <Grid m={0} p={0} container >
        {
            items.map(item=>{
                return <AccessButton {...item} key={item.title}/>
            })
        }
    </Grid>
  </Card>
  
}

function FieldPermissionComponent(props) {
    const { level } = props;

    return <Switch defaultChecked={level} />
}


function AccessButton(props){
    
    const [status,setStatus] = useState(props.status);

    function onChange(value){
        setStatus(value);
    }

    return <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
    <Box p={2} sx={{border:'1px solid',borderColor:'divider',display:'flex',justifyContent:'space-between',gap:2,alignItems:'center'}}>
        <Typography>{props.title}</Typography>
        <Select 
        placeholder={"Access Status"}
        onChange={onChange}
        value={status}
        loadind={true}
        style={{ width: 200, zIndex: 5 }}
        dropdownStyle={{ zIndex: 2000 }}        
        options={[
            {label:"Invisible",value:0},
            {label:"Read only",value:1},
            {label:"Create/Edit",value:2},
            {label:"Edit & Delete",value:3}
        ]}
        />
    </Box>
</Grid>
}