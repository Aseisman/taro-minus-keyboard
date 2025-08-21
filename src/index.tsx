import { View, Text } from '@tarojs/components';
import { useState, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';

interface MinusKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
  decimalLength?: number; // 新增：限制小数点后位数
}

const MinusKeyboard: React.FC<MinusKeyboardProps> = ({
  value,
  onChange,
  onConfirm,
  children,
  decimalLength = 2, // 默认限制2位小数
}) => {
  const [visible, setVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardRef = useRef<any>(null);
  const slotRef = useRef<any>(null);

  // 处理键盘按钮点击
  const handleKeyPress = (key: string, e: any) => {
    // 阻止默认行为和事件冒泡
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    
    const currentValue = typeof value === 'string' ? value : '';
    let newValue = currentValue;

    if (key === 'delete') {
      // 删除最后一个字符
      newValue = currentValue.slice(0, -1);
    } else if (key === '-') {
      // 处理负号
      if (currentValue.includes('-')) {
        newValue = currentValue.replace('-', '');
      } else {
        newValue = '-' + currentValue;
      }
    } else if (key === '.') {
      // 处理小数点
      if (!currentValue.includes('.')) {
        newValue = currentValue + '.';
      }
    } else {
      // 处理数字输入
      if (currentValue.includes('.')) {
        // 检查小数位数
        const decimalPart = currentValue.split('.')[1] || '';
        if (decimalPart.length < decimalLength) {
          newValue = currentValue + key;
        }
        // 小数位数已达限制，不做任何操作
      } else {
        // 没有小数点，直接追加
        newValue = currentValue + key;
      }
    }

    // 调用 onChange 前确保 newValue 是字符串
    onChange(newValue);
  };

  // 获取键盘高度
  useEffect(() => {
    if (visible) {
      // 在实际项目中，你可能需要根据不同的平台获取键盘高度
      // 这里简化处理，使用固定值或通过其他方式获取
      const height = 260; // 假设键盘高度为260px
      setKeyboardHeight(height);

      // 在小程序中可以这样获取元素高度
      if (process.env.TARO_ENV === 'weapp' && slotRef.current) {
        const query = Taro.createSelectorQuery();
        query.select('.keyboard').boundingClientRect();
        query.exec(res => {
          if (res && res[0]) {
            setKeyboardHeight(res[0].height);
          }
        });
      }
    }
  }, [visible]);

  // 点击外部关闭键盘
  useEffect(() => {
    if (!visible) return;

    const handleHideKeyboard = () => setVisible(false);

    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      Taro.eventCenter.on('hideKeyboard', handleHideKeyboard);
      return () => Taro.eventCenter.off('hideKeyboard', handleHideKeyboard);
    } else if (process.env.TARO_ENV === 'h5') {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          keyboardRef.current &&
          !keyboardRef.current.contains(e.target as Node) &&
          slotRef.current &&
          !slotRef.current.contains(e.target as Node)
        ) {
          setVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [visible]);

  // 阻止插槽点击事件冒泡
  const handleSlotClick = (e: any) => {
    // 在Taro部分版本中可能失效，https://github.com/NervJS/taro/issues/8605
    e.stopPropagation && e.stopPropagation();
    e.preventDefault && e.preventDefault();
    setVisible(!visible);
  };

  // 在小程序中点击蒙层关闭键盘
  const handleMaskClick = (e: any) => {
    e.stopPropagation && e.stopPropagation();
    e.preventDefault && e.preventDefault();
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      setVisible(false);
    }
  };

  // 处理按钮触摸开始事件（防止焦点）
  const handleTouchStart = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <View className='keyboard-container'>
      {/* 自定义插槽 - 添加浮动样式 */}
      <View
        ref={slotRef}
        className={`keyboard-slot ${visible ? 'keyboard-slot-float' : ''}`}
        style={visible ? { bottom: `${keyboardHeight}px` } : {}}
        onClick={handleSlotClick}
      >
        {children || (
          <View className='default-slot'>
            <Text>{value || '点击输入'}</Text>
          </View>
        )}
      </View>

      {/* 键盘 */}
      {visible && (
        <>
          {/* 小程序蒙层 */}
          {(process.env.TARO_ENV === 'weapp' ||
            process.env.TARO_ENV === 'alipay') && (
            <View 
              className='keyboard-mask' 
              onClick={handleMaskClick}
              onTouchStart={handleTouchStart}
            />
          )}

          <View className='keyboard' ref={keyboardRef}>
            <View className='keyboard-row'>
              {[1, 2, 3].map(num => (
                <View
                  key={num}
                  className='keyboard-key'
                  onClick={(e) => handleKeyPress(num.toString(), e)}
                  onTouchStart={handleTouchStart}
                >
                  <Text>{num}</Text>
                </View>
              ))}
            </View>
            <View className='keyboard-row'>
              {[4, 5, 6].map(num => (
                <View
                  key={num}
                  className='keyboard-key'
                  onClick={(e) => handleKeyPress(num.toString(), e)}
                  onTouchStart={handleTouchStart}
                >
                  <Text>{num}</Text>
                </View>
              ))}
            </View>
            <View className='keyboard-row'>
              {[7, 8, 9].map(num => (
                <View
                  key={num}
                  className='keyboard-key'
                  onClick={(e) => handleKeyPress(num.toString(), e)}
                  onTouchStart={handleTouchStart}
                >
                  <Text>{num}</Text>
                </View>
              ))}
            </View>
            <View className='keyboard-row'>
              <View
                className='keyboard-key'
                onClick={(e) => handleKeyPress('-', e)}
                onTouchStart={handleTouchStart}
              >
                <Text>-</Text>
              </View>
              <View
                className='keyboard-key'
                onClick={(e) => handleKeyPress('.', e)}
                onTouchStart={handleTouchStart}
              >
                <Text>.</Text>
              </View>
              <View
                className='keyboard-key'
                onClick={(e) => handleKeyPress('0', e)}
                onTouchStart={handleTouchStart}
              >
                <Text>0</Text>
              </View>
              <View
                className='keyboard-key delete-key'
                onClick={(e) => handleKeyPress('delete', e)}
                onTouchStart={handleTouchStart}
              >
                <Text>删除</Text>
              </View>
            </View>
            {onConfirm && (
              <View className='keyboard-row'>
                <View
                  className='keyboard-key confirm-key'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onConfirm();
                    setVisible(false);
                  }}
                  onTouchStart={handleTouchStart}
                >
                  <Text>确定</Text>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default MinusKeyboard;
