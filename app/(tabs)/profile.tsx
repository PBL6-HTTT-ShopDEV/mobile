import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ModalInput from '../../components/ModalInput';
import { useAuth } from '../../hooks/AuthContext';
import { router } from 'expo-router';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
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
        date_of_birth: user.date_of_birth || ''
      });
      console.log('Updated form data from user:', user);
    }
  }, [user]);

  const openModal = (content: string) => {
    console.log('Opening modal with content:', content);
    setModalContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalVisible(false);
  };

  const handleUpdateProfile = async () => {
    console.log('Attempting to update profile with data:', formData);
    try {
      await updateProfile({
        name: formData.name,
        phone_number: formData.phone_number,
        address: formData.address,
        date_of_birth: formData.date_of_birth
      });
      console.log('Profile update successful');
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      closeModal();
    } catch (error) {
      console.error('Profile update failed:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
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
            <View>
              <Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">
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
                  <Text className="text-white text-center font-bold">Lưu thay đổi</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {modalContent === 'changePassword' && (
            <Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">
              Đổi mật khẩu
            </Text>
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
