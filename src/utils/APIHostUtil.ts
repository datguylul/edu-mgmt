interface HostName {
  URL: string;
}

const APIHostName: HostName = {
  URL: process.env.HOST!,
};

export function getAPIHostName() {
  return APIHostName.URL;
}

export function setAPIHostName(url: string) {
  return (APIHostName.URL = url);
}
