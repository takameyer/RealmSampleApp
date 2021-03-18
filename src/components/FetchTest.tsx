import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

export const FetchTest = () => {
  const [result, setResult] = useState('');
  useEffect(() => {
    console.log('fetching... ');
    fetch('http://192.168.178.20:3000/syncedData?updatedAt=123')
      .then(response => response.json())
      .then(json => {
        console.log('then', json);
        setResult(JSON.stringify(json.data));
      });
  }, []);

  return (
    <View>
      <Text>{result}</Text>
    </View>
  );
};
