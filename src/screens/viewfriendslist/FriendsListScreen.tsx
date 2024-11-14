import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../../redux/slices/friendsSlice";
import { RootState } from "../../redux/store";
import { colors, fonts } from "../../constants/constants";

const FriendsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends.friends);

  useEffect(() => {
    if (!friends.some((friend) => friend.id === "1")) {
      dispatch(
        addFriend({
          id: "1",
          name: "testFriend",
          birthday: "02/21/2000",
          phone: "888-888-8888",
          email: "yulinglo@asu.edu",
          pronouns: "She/Her",
          imageUrl: "https://placeimg.com/140/140/people",
        })
      );
    }
  }, [dispatch, friends]);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}> 
        <Text style={styles.heading}>Friends List</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.backButton} >
            <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>

      {friends.map((friend, index) => (
        <TouchableOpacity
          key={friend.id + index} // Combining id and index for uniqueness
          style={styles.friendContainer}
          onPress={() => navigation.navigate("FriendProfile", { friend })}
        >
          <Text style={styles.friendName}>{friend.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      justifyContent: "flex-start",  
      backgroundColor: colors.white,
  },
  friendContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: colors.white,
    alignItems: 'center'
  },
  friendName: {
    fontSize: 18,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    fontFamily: fonts.regular,
    padding: '5%'
  },
  headingContainer:{
    alignItems: 'center',
    paddingTop: '10%'
  },
  backButton: {
    position: "absolute",
    top: '2%',
    left: '5%',
    paddingTop: '5%'
  },
  backButtonText: {
    fontSize: 18,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});

export default FriendsListScreen;
