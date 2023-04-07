const { AndroidConfig, withAndroidManifest } = require("expo/config-plugins")

const { getMainActivityOrThrow } = AndroidConfig.Manifest

async function modifyActivityConfig(
    config,
    androidManifest
) {
    const mainActivity = getMainActivityOrThrow(androidManifest)
    mainActivity.$['android:windowSoftInputMode'] = "adjustResize"
    return androidManifest
}

module.exports = function(config) {
    return withAndroidManifest(config, async config => {
      config.modResults = await modifyActivityConfig(config, config.modResults);
      return config;
    });
};