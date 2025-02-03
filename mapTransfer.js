// 将 WGS84 坐标转换为 GCJ-02 坐标
function wgs84ToGcj02(lng, lat) {
  const pi = 3.14159265358979323846;
  const a = 6378245.0; // 地球的半径
  const ee = 0.00669342162296594323; // 地球的偏心率平方

  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * pi;
  const magic = Math.sin(radLat);
  const magic2 = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic2);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic2 * sqrtMagic)) * pi);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);

  const mgLat = lat + dLat;
  const mgLng = lng + dLng;

  return { lng: mgLng, lat: mgLat };
}

// 判断是否在中国境内
function outOfChina(lng, lat) {
  if (lng < 72.004 || lng > 137.8347) return true;
  if (lat < 0.8293 || lat > 55.8271) return true;
  return false;
}

// 转换纬度
function transformLat(lng, lat) {
  const pi = 3.14159265358979323846;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * pi) + 40.0 * Math.sin((lat / 3.0) * pi)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * pi) +
      320.0 * Math.sin((lat * pi) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

// 转换经度
function transformLng(lng, lat) {
  const pi = 3.14159265358979323846;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * pi) + 20.0 * Math.sin(2.0 * lng * pi)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * pi) + 40.0 * Math.sin((lng / 3.0) * pi)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * pi) +
      300.0 * Math.sin((lng / 30.0) * pi)) *
      2.0) /
    3.0;
  return ret;
}

// GCJ-02 转 BD09 坐标
function gcj02ToBd09(lng, lat) {
  const x = lng;
  const y = lat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
  const bdLng = z * Math.cos(theta) + 0.0065;
  const bdLat = z * Math.sin(theta) + 0.006;

  return { lng: bdLng, lat: bdLat };
}

// WGS84 坐标转换为 BD09 坐标
export function wgs84ToBd09(lng, lat) {
  const gcj02 = wgs84ToGcj02(lng, lat); // WGS84 转 GCJ-02
  return gcj02ToBd09(gcj02.lng, gcj02.lat); // GCJ-02 转 BD09
}
