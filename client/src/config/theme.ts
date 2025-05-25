import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#458ac9',
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: '#458ac9',
      algorithm: true,
    },
  },
};

export default theme;