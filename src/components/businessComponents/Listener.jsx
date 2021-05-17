import { gql, useSubscription } from '@apollo/client';
import React from 'react';

const listenedData = gql`
  subscription {
      listen
  }
`;

export default function Listener({ onListenedData }) {
    const { loading, error, data } = useSubscription(listenedData);

    if (loading) {
        console.log('Loading....');
    }
    if (error) {
        console.log(error);
    }

    if (data) {
        onListenedData(data);
    }

    return <></>;
}
