import * as React from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const Men = () => (
  <View style={{ flex: 1 }}>
    <Text style={styles.title}>Men</Text>
    <Text>Men Content</Text>
  </View>
);

const Women = () => (
  <View style={{ flex: 1 }}>
    <Text style={styles.title}>Women</Text>
    <Text>Women Content</Text>
  </View>
);

const Kids = () => (
  <View style={{ flex: 1 }}>
    <Text style={styles.title}>Kids</Text>
    <Text>Kids Content</Text>
  </View>
);


export default function CategoryTabs() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'men', title: 'Men' },
    { key: 'women', title: 'Women' },
    { key: 'kids', title: 'Kids' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      {/* Your Top Title */}
      {/* <Text style={styles.title}>Categories</Text> */}
         <Text style={styles.title}>{routes[index].title}</Text>
      <TabView
        
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          men: Men,
          women: Women,
          kids: Kids,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: 'white', elevation: 0 }}
            indicatorStyle={{ backgroundColor: '#8A8AFF', height: 3, borderRadius: 10 }}
            labelStyle={{ color: 'black', fontWeight: '600' }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
   title: {
    // fontSize: 20,
    fontWeight: '700',
    margin: 16,
    color: 'black',
  },
});
