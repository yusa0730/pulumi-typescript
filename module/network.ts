import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface NetworkArgs {
  cidrBlock: string;
  numberOfAzs: number;
  enableNatGateways?: boolean;
  tags?: { [key: string]: string };
}

export class Network extends pulumi.ComponentResource {
  public vpc: aws.ec2.Vpc = {} as aws.ec2.Vpc;
  public readonly subnets: aws.ec2.Subnet[] = [];
  public readonly routeTables: aws.ec2.RouteTable[] = [];
  public readonly natGateways?: aws.ec2.NatGateway[] = [];
  public readonly env: string;
  public readonly projectName: string;
  public readonly args: NetworkArgs;

  constructor(env: string, projectName: string, args: NetworkArgs, opts?: pulumi.ResourceOptions) {
    super("custom:resource:Network", projectName, {}, opts);

    this.env = env;
    this.projectName = projectName;
    this.args = args;
  }

  public invoke() {
    this.vpc = this.createVpc(
      this.projectName,
      this.env,
      this.args
    );

    // Register outputs
    this.registerOutputs({
      vpcId: this.vpc.id,
      // subnetIds: this.subnets.map((s) => s.id),
      // routeTableIds: this.routeTables.map((rt) => rt.id),
      // natGatewayIds: this.natGateways?.map((ng) => ng.id),
    });
  }

  private createVpc(projectName: string, env: string, args: NetworkArgs): aws.ec2.Vpc {
    return new aws.ec2.Vpc(`${projectName}-${env}-vpc`, {
      cidrBlock: args.cidrBlock,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      tags: {
        Name: `${projectName}-${env}-vpc`,
        ...args.tags,
      },
    }, { parent: this });
  }
}