import { View, Text,TouchableOpacity } from 'react-native'
import React ,{useState} from 'react'

const ExpandablePanel = ({tittle,content}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
      };
  return (
    <View>
        <TouchableOpacity className="flex-row items-start justify-between" onPress={toggleAccordion}>
            <Text className='text-white font-vollkorn-bold '>{tittle}</Text>
            <Text className='text-blue px-16 py-4'>{isExpanded ? '▲' : '◀'}</Text>
        </TouchableOpacity>
        {isExpanded && 
        <View>{content.map((item, index) => (
            <Text key={index} className='font-vollkorn-regular text-white'>{item}</Text>))}
        </View>}
    </View>
  )
}

export default ExpandablePanel