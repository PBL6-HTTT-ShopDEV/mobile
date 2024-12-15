import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { ITourFilters } from '../types/Tour.types';

const StyledView = styled(View);
const StyledText = styled(Text);

interface FilterModalProps {
  visible: boolean;
  filters: ITourFilters;
  onClose: () => void;
  onApplyFilters: (filters: ITourFilters) => void;
}

const PRICE_RANGES = [
  { label: 'Tất cả', value: '' },
  { label: 'Dưới 2 triệu', value: '0-2000000' },
  { label: '2 - 4 triệu', value: '2000000-4000000' },
  { label: '4 - 6 triệu', value: '4000000-6000000' },
  { label: '6 - 10 triệu', value: '6000000-10000000' },
  { label: 'Trên 10 triệu', value: '10000000-999999999' },
];

const DEPARTURE_TIMES = [
  { label: 'Tất cả', value: '' },
  { label: 'Trong tháng này', value: 'this_month' },
  { label: 'Tháng tới', value: 'next_month' },
  { label: '3 tháng tới', value: 'next_3_months' },
  { label: '6 tháng tới', value: 'next_6_months' },
];

const DESTINATIONS = [
  { label: 'Tất cả', value: '' },
  { label: 'Miền Bắc', value: 'north' },
  { label: 'Miền Trung', value: 'central' },
  { label: 'Miền Nam', value: 'south' },
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onClose,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleSelectFilter = (type: keyof ITourFilters, value: string) => {
    setLocalFilters(prev => ({...prev, [type]: value}));
  };

  const renderFilterOption = (
    type: keyof ITourFilters,
    label: string,
    value: string,
    isSelected: boolean
  ) => (
    <TouchableOpacity
      key={`${type}-${value}`}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
        isSelected ? 'bg-blue border-blue' : 'bg-white border-gray-300'
      }`}
      onPress={() => handleSelectFilter(type, value)}
    >
      <StyledText 
        className={`${isSelected ? 'text-white' : 'text-gray-700'} font-vollkorn`}
      >
        {label}
      </StyledText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <StyledView className="flex-1 bg-black/50 justify-end">
        <StyledView className="bg-white rounded-t-xl p-4 h-3/4">
          <StyledText className="text-xl font-vollkorn-bold mb-4">Bộ lọc</StyledText>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <StyledView className="mb-6">
              <StyledText className="text-lg font-vollkorn-bold mb-3">Khu vực</StyledText>
              <StyledView className="flex-row flex-wrap">
                {DESTINATIONS.map(item => 
                  renderFilterOption(
                    'destination',
                    item.label,
                    item.value,
                    localFilters.destination === item.value
                  )
                )}
              </StyledView>
            </StyledView>

            <StyledView className="mb-6">
              <StyledText className="text-lg font-vollkorn-bold mb-3">Mức giá</StyledText>
              <StyledView className="flex-row flex-wrap">
                {PRICE_RANGES.map(item => 
                  renderFilterOption(
                    'price',
                    item.label,
                    item.value,
                    localFilters.price === item.value
                  )
                )}
              </StyledView>
            </StyledView>

            <StyledView className="mb-6">
              <StyledText className="text-lg font-vollkorn-bold mb-3">Thời gian khởi hành</StyledText>
              <StyledView className="flex-row flex-wrap">
                {DEPARTURE_TIMES.map(item => 
                  renderFilterOption(
                    'start_date',
                    item.label,
                    item.value,
                    localFilters.start_date === item.value
                  )
                )}
              </StyledView>
            </StyledView>
          </ScrollView>

          <StyledView className="flex-row justify-end space-x-4 pt-4 border-t border-gray-200">
            <TouchableOpacity
              className="px-6 py-3 rounded-full bg-gray-100"
              onPress={onClose}
            >
              <StyledText className="font-vollkorn">Hủy</StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-full bg-blue"
              onPress={() => {
                onApplyFilters(localFilters);
                onClose();
              }}
            >
              <StyledText className="text-white font-vollkorn">Áp dụng</StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </Modal>
  );
};

export default FilterModal; 