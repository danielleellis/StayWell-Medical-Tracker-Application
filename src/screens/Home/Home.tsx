// features/counter/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { increment, decrement, incrementByAmount } from '../../store/Member/slice';
import { View, Text, Button } from 'react-native';

const Home = () => {
  const count = useSelector((state: RootState) => state.member.value);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>{count}</Text>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
      <Button onPress={() => dispatch(incrementByAmount(2))} title="Increment by 2" />
    </View>
  );
};

export default Home;
