import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoad } from '@rock/ussr/client';
import { fetchDog } from './action';

const Dogs = () => {
    const onLoad = useLoad();
    const dispatch = useDispatch();
    const dog = useSelector(state => state.dogReducer);

    onLoad(() => dispatch(fetchDog()));

    return (
        <div>
            {dog.loading ?
                <p>Loading...</p> :
                dog.error ?
                    <p>Error, try again</p> :
                    <p><img src={dog.url} alt="Dog" /></p>}
        </div>
    );
};

export default Dogs;