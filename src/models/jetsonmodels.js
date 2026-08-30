import mongoose from 'mongoose';

const JetsonNanoSchema = new mongoose.Schema({
  ExpId: Number,
  Tname: String,
  Disc1: String,
  Disc2: String,

  Compreq: [{ comp: String }],

  ST1: String,
  D1: String,
  D2: String,
  D3: String,
  D4: String,
  D5: String,
  D6: String,
  D7: String,

  ST2: String,
  ST3: String,
  Disc: String,

  JNDkit: [{ D1: String }],

  ST4: String,
  J_SDK: [{ D2: String }],

  ST5: String,
  PS_Options: [{ D3: String }],

  ST6: String,
  CS_Options: [{ D4: String }],

  ST7: String,
  CE_Options: [{ D5: String }],

  ST8: String,
  ST9: String,
  App_Options: [{ D6: String }],

  ST10: String,
  EndV: String,

  ST11: String,
  GS_Steps: [{ D7: String }],

  ST12: String,
  ST13: String,
  SDdisc: [{ Disc1: String }],

  ST14: String,
  MusbDisc: [{ Disc1: String }],

  ST15: String,
  Note: [{ D1: String }],

  ST16: String,
  Mdata: String,
  SDsteps: [{ W2: String }],

  ST17A: String,
  Formatsdcard: String,
  FSteps: [{ S1: String }],

  Write_Image: String,
  Write_Steps: [{ W1: String }],

  ST17B: String,
  Mac: String,
  Etcherinfo: String,
  EtcherSteps: [{ E1: String }],
  CLI: String,
  CLIS: [{ S1: String }],

  ST17C: String,
  LinuxM: [{ L1: String }],
  ELI: String,
  EL_S: [{ S1: String }],
  CLI_Linus: String,
  CLI_S: [{ S1: String }],

  Setup1stboot: String,
  SetupDesc: String,
  SetupOptions: [{ S1: String }],
  Setup_Steps: [{ S1: String }],

  FBoot: String,
  FB_Desc: String,
  Initial_Setup: [{ S1: String }],

  ST: String,
  ST_Desc: String,

  InitialSHM: String,
  Desc: [{ D1: String }],

  S_Steps: String,
  Steps: [{ S1: String }],

  ST18: String,
  Conc_Bpoint: [{ P1: String }],

  img1: String,
}, { timestamps: true });

export const jetsons= mongoose.models.jetsons || mongoose.model('jetsons', JetsonNanoSchema);
