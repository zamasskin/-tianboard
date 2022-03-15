import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';

const UserEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();

    const backPathStrLength = location.pathname.length - String(userId).length - 1;
    const backPath = location.pathname.substring(0, backPathStrLength);
    return <MainCard>123</MainCard>;
};

export default UserEdit;
