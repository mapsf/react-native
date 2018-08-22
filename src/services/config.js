import config from './../../app'

export default function (key, defaultValue = null) {
  return typeof config[key] !== undefined ? config[key] : defaultValue;
}
