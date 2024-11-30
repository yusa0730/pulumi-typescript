import { Network, NetworkArgs } from "./module/network";

const env = "dev";
const projectName = "pulumi-test";

// ネットワーク構成の引数を指定
const networkArgs: NetworkArgs = {
    cidrBlock: "10.0.0.0/16",
    numberOfAzs: 2,
    enableNatGateways: true,
    tags: { projectName: projectName, Environment: env }, // AWS リソースに付与するタグ
};

// Network モジュールをインスタンス化して利用
const network = new Network(env, projectName, networkArgs);

// invoke メソッドを呼び出してリソースを作成
network.invoke();

// エクスポート（Pulumi で出力として確認可能）
export const vpcId = network.vpc.id;