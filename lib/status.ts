import ui from "@/app/data/ui.json";

type Status = {
  name: string;
};

const statuses: { [key: string]: Status } = {
  new: { name: ui.status.new },
  prepay: { name: ui.status.prepay },
  inprogress: { name: ui.status.inprogress },
  finished: { name: ui.status.finished },
  ready: { name: ui.status.ready },
  canceled: { name: ui.status.canceled },
};

export default statuses;
