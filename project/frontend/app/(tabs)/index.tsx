import {Link} from "expo-router"; 
import {View ,Text} from "react-native"; 

export default function Home(){
    return(

        <View style={{flex:1, justifyContent: "center", gap : 16 , padding:24}}> 
        <Text style={{fontSize: 22, fontWeight:"700"}}> Rinku AI </Text>
        <Link href="/(tabs)/people"> View Loved Ones</Link>
        <Link href="/(tabs/add)"> Add Loved One</Link>
        <Link href="/(tabs)/recognize">Recognize (Camera)</Link>
        
        </View>


    );
}