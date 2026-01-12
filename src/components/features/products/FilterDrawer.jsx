import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CustomCheckBox = ({ checked = false, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        { borderColor: checked ? '#5A6CF3' : '#999', backgroundColor: checked ? '#5A6CF3' : 'transparent' }
      ]}
    >
      {checked && (
        <Text style={{color:'#fff', fontSize:14}}>✓</Text>
      )}
    </TouchableOpacity>
  );
};

const FilterDrawer = ({
  visible,
  onClose,
  slideAnim,
  filterSections = [], // [{key:'category', title:'Category', options:[{id:'1', label:'Shirts'}]}]
  selectedFilters = {}, // { category: ['Shirt', 'T-shirts'], gender: ['Male'] }
  onApply, // returns final selections
  onClear, // clear all selections
  height = SCREEN_HEIGHT * 0.78
}) => {
  
  const [activeSection, setActiveSection] = useState(filterSections[0]?.key);
  const [localFilters, setLocalFilters] = useState(selectedFilters);


  useEffect(() => {
    setLocalFilters(selectedFilters);
  }, [selectedFilters]);

  const toggleOption = (sectionKey, label) => {
    const current = localFilters[sectionKey] || [];
    const exists = current.includes(label);

    const updated = exists
      ? current.filter((i) => i !== label)
      : [...current, label];

    setLocalFilters({
      ...localFilters,
      [sectionKey]: updated,
    });
  };

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      {filterSections.map((section) => (
        <TouchableOpacity
          key={section.key}
          style={[
            styles.sidebarItem,
            activeSection === section.key && styles.sidebarItemActive,
          ]}
          onPress={() => setActiveSection(section.key)}
        >
          <Text
            style={[
              styles.sidebarItemText,
              activeSection === section.key && styles.sidebarItemTextActive,
            ]}
          >
            {section.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOptions = () => {
    const section = filterSections.find((s) => s.key === activeSection);
    const currentSelected = localFilters[section.key] || [];

    return (
      <FlatList
        data={section.options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const checked = currentSelected.includes(item.label);

          return (
            <View style={styles.optionRow}>
              {/* <CheckBox
                value={checked}
                onValueChange={() => toggleOption(section.key, item.label)}
                tintColors={{ true: '#5A6CF3', false: '#999' }}
              /> */}
              <CustomCheckBox
                checked={checked}
                onPress={() => toggleOption(section.key, item.label)}
              />
              <Text style={styles.optionLabel}>{item.label}</Text>
            </View>
          );
        }}
      />
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawerContainer,
            { height, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.headerText}>Filters</Text>

          <View style={styles.contentRow}>
            {renderSidebar()}
            <View style={styles.optionsContainer}><View><Text style={{fontSize:20}}></Text></View>{renderOptions()}</View>
          </View>

          <View style={styles.footer}>
            {/* <View style={{flex: 0.03, justifyContent: 'center'}} ><Text style={{fontSIze: 22, fontWeight: '700'}}> 1000 + Products</Text></View> */}
            <TouchableOpacity style={styles.clearBtn} onPress={() => onClear()}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => onApply(localFilters)}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlay: { flex: 1 },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  headerText: {
    fontSize: 21,
    fontWeight: '700',
    padding: 15,
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 110,
    backgroundColor: '#F4F6FE',
    paddingVertical: 5,
  },
  sidebarItem: {
    paddingVertical: 14,
    paddingLeft: 14,
  },
  sidebarItemActive: {
    backgroundColor: '#DFE4FF',
    borderLeftWidth: 4,
    borderLeftColor: '#5A6CF3',
  },
  sidebarItemText: {
    fontSize: 15,
    color: '#444',
  },
  sidebarItemTextActive: {
    fontWeight: '700',
    color: '#5A6CF3',
  },
  optionsContainer: {
    flex: 1,
    padding: 15,
    // backgroundColor: 'red'
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 16,
    // backgroundColor: 'red'
  },
  clearBtn: {
    flex: 1,
    // backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5A6CF3'
  },
  clearText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  doneBtn: {
    flex: 1,
    backgroundColor: '#5A6CF3',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});

export default FilterDrawer;
