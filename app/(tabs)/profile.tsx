import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ModalInput from '../../components/ModalInput';
import { useAuth } from '../../hooks/AuthContext';
import { router } from 'expo-router';
import { format, isValid, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { UpdateProfilePayload } from '../../types/User.types';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Debug logs
  console.log('Profile Render - Current user:', user);
  console.log('Is user authenticated:', !!user);

  useEffect(() => {
    console.log('Profile Mount - User data:', user);
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
    date_of_birth: user?.date_of_birth || ''
  });

  // Debug log khi formData thay đổi
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  // Thêm useEffect để cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth ? formatDateForDisplay(user.date_of_birth) : ''
      });
      console.log('Updated form data from user:', user);
    }
  }, [user]);

  // Thêm state cho form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const openModal = (content: string) => {
    console.log('Opening modal with content:', content);
    setModalContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalVisible(false);
  };

  const formatDateString = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Xử lý cả trường hợp ISO string và định dạng YYYY-MM-DD
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format: DD/MM/YYYY
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Parse ngày từ định dạng DD/MM/YYYY
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      // Chuyển sang định dạng YYYY-MM-DD
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date for API:', error);
      return '';
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Thử parse từ ISO string hoặc YYYY-MM-DD
      const date = new Date(dateString);
      if (!isValid(date)) return '';
      
      // Format sang DD/MM/YYYY
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return '';
    }
  };

  const resetFormData = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth ? formatDateForDisplay(user.date_of_birth) : ''
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      // Validate dữ liệu
      if (!formData.name?.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
        return;
      }

      if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
        Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
        return;
      }

      if (formData.date_of_birth) {
        try {
          // Kiểm tra định dạng ngày hợp lệ
          const parsedDate = parse(formData.date_of_birth, 'dd/MM/yyyy', new Date());
          if (isNaN(parsedDate.getTime())) {
            Alert.alert('Lỗi', 'Ngày sinh không hợp lệ (DD/MM/YYYY)');
            return;
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Ngày sinh không hợp lệ (DD/MM/YYYY)');
          return;
        }
      }

      // Chỉ gửi những trường đã được cập nhật
      const updatedFields: UpdateProfilePayload = {};
      
      if (formData.name !== user?.name) updatedFields.name = formData.name;
      if (formData.phone_number !== user?.phone_number) updatedFields.phone_number = formData.phone_number;
      if (formData.address !== user?.address) updatedFields.address = formData.address;
      
      // So sánh ngày tháng sau khi đã format
      const currentDate = user?.date_of_birth ? formatDateForDisplay(user.date_of_birth) : '';
      if (formData.date_of_birth && formData.date_of_birth !== currentDate) {
        updatedFields.date_of_birth = formatDateForAPI(formData.date_of_birth);
      }

      // Chỉ gọi API nếu có thay đổi
      if (Object.keys(updatedFields).length > 0) {
        await updateProfile(updatedFields);
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        closeModal();
      } else {
        Alert.alert('Thông báo', 'Không có thông tin nào được thay đổi');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đăng xuất',
          onPress: handleLogout,
          style: 'destructive'
        }
      ]
    );
  };

  const handleMenuClick = (content: string) => {
    if (content === 'logout') {
      confirmLogout();
    } else {
      openModal(content);
    }
  };

  const renderProfileSection = () => (
    <View className="bg-white rounded-lg p-4 mt-4">
      <Text className="text-xl font-vollkorn-bold mb-4">Thông tin cá nhân</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Họ tên:</Text>
          <Text className="font-vollkorn-regular">{user?.name || 'Chưa cập nhật'}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Email:</Text>
          <Text className="font-vollkorn-regular">{user?.email}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Số điện thoại:</Text>
          <Text className="font-vollkorn-regular">{user?.phone_number || 'Chưa cập nhật'}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Địa chỉ:</Text>
          <Text className="font-vollkorn-regular">{user?.address || 'Chưa cập nhật'}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Ngày sinh:</Text>
          <Text className="font-vollkorn-regular">
            {user?.date_of_birth ? formatDateForDisplay(user.date_of_birth) : 'Chưa cập nhật'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-blue-500 p-3 rounded-lg mt-4"
        onPress={() => setModalContent('personalInfo')}
        disabled={isUpdating}
      >
        <Text className="text-white text-center font-vollkorn-bold">
          Cập nhật thông tin
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-5">
      <Text className='text-center font-vollkorn-bold text-3xl text-blue mt-1'>
        Hồ sơ của bạn
      </Text>

      <View className='rounded-card bg-default'>
        <View className='ml-5 flex-row items-center'>
          <FontAwesome name="user-circle" size={40} color="black" />
          <Text className='font-vollkorn-bold text-lg ml-3'>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => handleMenuClick('personalInfo')} className="my-4 ml-6">
          <Text className="text-lg">Thông tin cá nhân</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuClick('changePassword')} className="my-4 ml-6">
          <Text className="text-lg">Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuClick('logout')} className="my-4 ml-6">
          <Text className="text-lg">Đăng xuất</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuClick('deleteAccount')} className="my-4 ml-6">
          <Text className="text-lg">Xóa tài khoản</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.3}
        className="m-0 justify-center"
      >
        <View className="bg-white p-5 rounded-2xl">
          <TouchableOpacity className='absolute top-8 left-2 z-10 pr-10' onPress={closeModal}>
            <Ionicons name="chevron-back-outline" size={36} color="black" />
          </TouchableOpacity>
          
          {modalContent === 'personalInfo' && (
            <View className="bg-white p-5 rounded-2xl">
              <TouchableOpacity 
                className='absolute top-2 right-2 z-10 p-2' 
                onPress={closeModal}
              >
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
              
              <Text className="text-2xl font-vollkorn-bold text-blue text-center mb-4">
                Thông tin cá nhân
              </Text>
              
              <View>
                <ModalInput 
                  label="Họ và tên"
                  placeholder="Nhập họ tên"
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={formData.name}
                  onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
                />
                <ModalInput 
                  label="Email"
                  placeholder={user?.email}
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={formData.email}
                  editable={false}
                />
                <ModalInput 
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={formData.phone_number}
                  onChangeText={(text) => setFormData(prev => ({...prev, phone_number: text}))}
                />
                <ModalInput 
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ"
                  isRequired={false}
                  onEdit={() => {}}
                  initialValue={formData.address}
                  onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
                />
                <ModalInput 
                  label="Ngày sinh"
                  placeholder="YYYY-MM-DD"
                  isRequired={false}
                  onEdit={() => {}}
                  initialValue={formData.date_of_birth}
                  onChangeText={(text) => setFormData(prev => ({...prev, date_of_birth: text}))}
                />
                
                <TouchableOpacity 
                  onPress={handleUpdateProfile}
                  className="bg-blue-500 p-3 rounded-lg mt-4"
                >
                  <Text className="text-black text-2xl text-center font-vollkorn-bold">Lưu thay đổi</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {modalContent === 'changePassword' && (
            <View className="bg-white p-5 rounded-2xl">
              <TouchableOpacity 
                className='absolute top-2 right-2 z-10 p-2' 
                onPress={closeModal}
              >
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
              
              <Text className="text-2xl font-vollkorn-bold text-blue text-center mb-4">
                Đổi mật khẩu
              </Text>
              
              <View>
                <ModalInput 
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu hiện tại"
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={passwordForm.currentPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({...prev, currentPassword: text}))}
                  secureTextEntry={true}
                />
                <ModalInput 
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={passwordForm.newPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({...prev, newPassword: text}))}
                  secureTextEntry={true}
                />
                <ModalInput 
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu mới"
                  isRequired={true}
                  onEdit={() => {}}
                  initialValue={passwordForm.confirmPassword}
                  onChangeText={(text) => setPasswordForm(prev => ({...prev, confirmPassword: text}))}
                  secureTextEntry={true}
                />
                
                <TouchableOpacity 
                  className="bg-blue-500 p-3 rounded-lg mt-4"
                  onPress={() => {
                    // Xử lý logic đổi mật khẩu ở đây
                    Alert.alert('Thông báo', 'Chức năng đang được phát triển');
                  }}
                >
                  <Text className="text-white text-center font-vollkorn-bold">
                    Cập nhật mật khẩu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {modalContent === 'deleteAccount' && (
            <Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">
              Xóa tài khoản
            </Text>
          )}
        </View>
      </Modal>

      <TouchableOpacity 
        className="mt-8 bg-red-500 py-3 px-6 rounded-lg"
        onPress={confirmLogout}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white font-vollkorn-regular text-lg ml-2">
            Đăng xuất
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
