import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ModalInput from '../../components/ModalInput';
const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = (content: string) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View className="p-5 bg-white">
      {/* Các nút khác nhau cho Profile */}
      <Text className='text-center font-vollkorn-bold text-3xl text-blue mt-1'>Hồ sơ của bạn</Text>
      <View className='rounded-card bg-default'>
      <View className='ml-5 flex-row items-center'>
      <FontAwesome name="user-circle" size={40} color="black" />
      <Text className='font-vollkorn-bold text-lg ml-3'>Vương Phạm Ngọc Huy</Text>
      </View>
        <TouchableOpacity onPress={() => openModal('personalInfo')} className="my-4 ml-6">
        <Text className="text-lg">Thông tin cá nhân</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('changePassword')} className="my-4 ml-6">
        <Text className="text-lg">Đổi mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('logout')} className="my-4 ml-6">
        <Text className="text-lg">Đăng xuất</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('deleteAccount')} className="my-4 ml-6">
        <Text className="text-lg">Xóa tài khoản</Text>
      </TouchableOpacity>
      </View>
      

      {/* Modal Component */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.3}
        className="m-0 justify-center"
      >
        <View className="bg-white p-5 rounded-2xl">
        <TouchableOpacity className='absolute top-8 left-2 z-10 pr-10' onPress={() => closeModal()}>
      <Ionicons name="chevron-back-outline" size={36} color="black" /> 
      </TouchableOpacity>
          {modalContent === 'personalInfo' && (
            <View >
              <Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">Thông tin cá nhân</Text>
              <View>
              <ModalInput label="Họ và tên"
        placeholder="Gaylord Focker"
        isRequired={true}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Email"
        placeholder="huy041203@gmail.com"
        isRequired={true}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Số điện thoại"
        placeholder="0905814203"
        isRequired={true}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Địa chỉ"
        placeholder="45 Cù Chính Lan, Đà Nẵng"
        isRequired={false}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Giới tính"
        placeholder="Nam"
        isRequired={false}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Ngày sinh"
        placeholder="04/12/2003"
        isRequired={false}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="CCCD"
        placeholder="***********"
        isRequired={false}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/>
        <ModalInput label="Tổng số tour đã đi"
        placeholder="1"
        isRequired={false}
        onEdit={() => {}}
        initialValue=""
        onChangeText={()=> {}}/></View></View>)}
          {modalContent === 'changePassword' && (<Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">Đổi mật khẩu</Text>)}
      {modalContent === 'deleteAccount' && (<Text className="text-2xl font-vollkorn-bold text-blue text-center mt-3">Xóa tài khoản</Text>)}
          {modalContent === 'logout' && <Text className="text-lg">Xác nhận đăng xuất</Text>}
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
