import { View, Text,TouchableOpacity } from 'react-native'
import React ,{useState} from 'react'

const ExpandablePanel = ({tittle,content}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
      };
  return (
    <View className='mb-4'>
        <TouchableOpacity className="flex-row items-start justify-between" onPress={toggleAccordion}>
            <Text className='text-black font-vollkorn-bold text-xl flex-1'>{tittle}</Text>
            <Text className='text-blue ml-2'>{isExpanded ? '▲' : '◀'}</Text>
        </TouchableOpacity>
        {isExpanded && 
        <View>{content.map((item, index) => (
            <Text key={index} className='tracking-wider font-vollkorn-regular text-lg text-black mx-auto'>{item}</Text>))}
        </View>}
    </View>
  )
}

export default ExpandablePanel